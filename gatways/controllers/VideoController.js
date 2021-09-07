const useCases = require("../../application/use_cases/main");
const serviceLocator = require("../../core/config/serviceLocator");
const VideoService = require("../services/VideoService");
const { IVideo } = require("../../interfaces/IVideo");
const { methods } = require("../../core/config/consts");
const { isRequired } = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/config/libs/ResponseService");

class VideoController {
  constructor() {
    this.service = new VideoService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;

      const video = new IVideo(JSON.parse(body));

      await isRequired(video.name, 400);

      this.service.checkVideoExists(
        video,
        {
          FindOneSession: useCases.Video.FindOneVideo,
        },
        serviceLocator
      );

      const result = this.service.create(
        vodeo,
        {
          CreateVideo: useCases.Video.CreateVideo,
        },
        serviceLocator
      );

      return successfullyCreated({ data: result });
    } catch (error) {
      return handleError({ error });
    }
  }

  async pagination({ pathParameters, queryStringParameters }) {
    try {
      await isRequired(pathParameters.page, 400);
      await isRequired(pathParameters.sessionId, 400);

      const result = await this.service.pagination(
        pathParameters,
        {
          Pagination: useCases.Video.Pagination,
        },
        serviceLocator
      );
      let videos;
      const { subscriberId } = queryStringParameters;

      videos = this.service.videosLikedsByUser({
        videos: result,
        subscriberId: subscriberId,
      });

      return successfullyRead({ data: videos });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async like({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const { subscriberId, videoId } = pathParameters;
      isRequired(subscriberId, 400);
      isRequired(videoId, 400);
      const video = await this.service.like(
        {
          subscriberId: subscriberId,
          videoId: videoId,
        },
        serviceLocator
      );
      return successfullyRead({ data: video });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async unlike({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const { subscriberId, videoId } = pathParameters;
      isRequired(subscriberId, 400);
      isRequired(videoId, 400);
      const video = await this.service.unlike(
        {
          subscriberId: subscriberId,
          videoId: videoId,
        },
        serviceLocator
      );
      return successfullyRead({ data: video });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findLikedsBySubscriber({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const { subscriberId } = pathParameters;
      isRequired(subscriberId, 400);
      const videos = await this.service.findLikedsBySubscriber(
        {
          subscriberId: subscriberId,
        },
        serviceLocator
      );
      return successfullyRead({ data: videos });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
}

module.exports = VideoController;
