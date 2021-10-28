const useCases = require("../../application/use_cases/main");
const serviceLocator = require("../../core/config/serviceLocator");
const SessionService = require("../services/SessionService");
const VideoService = require("../services/VideoService");
const { isRequired, fildExists } = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/config/libs/ResponseService");

class HomeController {
  constructor() {
    this.service = new SessionService();
    this.videoService = new VideoService();
  }

  async loadHomeSessions({ pathParameters, queryStringParameters }) {
    try {
      if (!pathParameters) throw 400;
      const { tag } = pathParameters;
      const subscriberId = fildExists(queryStringParameters.subscriberId, "");
      const limit = fildExists(queryStringParameters.limit, 5);

      isRequired(tag, 400);

      let result = await this.service.findAll(
        {
          limit: limit,
          tag: tag,
        },
        {
          FindAllSessions: useCases.Session.FindAll,
          FindAllVideos: useCases.Video.FindAll,
        },
        serviceLocator
      );
      result = result.map((session) => {
        session.videos = this.videoService.isLikedBySubscriber({
          videos: session.videos,
          subscriberId: subscriberId,
        });
        return session;
      });
      let findRankedVideos = await this.videoService.findRankedVideo(
        { RankedVideos: useCases.Video.RankedVideos },
        serviceLocator
      );
      findRankedVideos = this.videoService.isLikedBySubscriber({
        videos: findRankedVideos,
        subscriberId: subscriberId,
      });
      result.push(...findRankedVideos);

      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }

  async update() {}
}

module.exports = HomeController;
