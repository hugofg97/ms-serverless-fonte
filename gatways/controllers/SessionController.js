const useCases = require("../../application/use_cases/main");
const serviceLocator = require("../../core/config/serviceLocator");
const SessionService = require("../services/SessionService");
const VideoService = require("../services/VideoService");
const { ISession } = require("../../interfaces/ISession");
const { methods } = require("../../core/config/consts");
const { isRequired } = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/config/libs/ResponseService");

class SessionController {
  constructor() {
    this.service = new SessionService();
    this.videoService = new VideoService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;

      const session = new ISession(JSON.parse(body));

      await isRequired(session.name, 400);
      await isRequired(session.description, 400);

      await this.service.findByName(
        session,
        {
          FindByName: useCases.Session.FindByName,
        },
        serviceLocator
      );

      const result = await this.service.create(
        session,
        {
          Create: useCases.Session.Create,
        },
        serviceLocator
      );

      return successfullyCreated({ data: result });
    } catch (error) {
      return handleError({ error });
    }
  }
  async findAll({ queryStringParameters }) {
    try {
      let result = await this.service.findAll(
        {
          FindAllSessions: useCases.Session.FindAll,
          FindAllVideos: useCases.Video.FindAll,
        },
        serviceLocator
      );
      const { subscriberId } = queryStringParameters;
      console.log(subscriberId);
      result = result.map((session) => {
        session.videos = this.videoService.videosLikedsByUser({
          videos: session.videos,
          subscriberId: subscriberId,
        });
        return session;
      });
      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }

  async pagination({ pathParameters, queryStringParameters }) {
    try {
      await isRequired(pathParameters.page, 400);

      let result = await this.service.pagination(
        pathParameters,
        {
          Pagination: useCases.Session.Pagination,
          FindAllVideos: useCases.Video.FindAll,
        },
        serviceLocator
      );
      const { subscriberId } = queryStringParameters;

      result = result.map((session) => {
        session.videos = this.videoService.videosLikedsByUser({
          videos: session.videos,
          subscriberId: subscriberId,
        });
        return session;
      });

      console.log(result);
      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async update() {}
}

module.exports = SessionController;
