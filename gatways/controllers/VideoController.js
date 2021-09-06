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
  async create({ body }) {
    try {
      if (!body) throw 400;

      const video = new IVideo(JSON.parse(body));

      const videoService = new VideoService();

      await isRequired(video.name, 400);

      await videoService.checkVideoExists(
        video,
        {
          FindOneSession: useCases.Video.FindOneVideo,
        },
        serviceLocator
      );

      const result = await videoService.createVideo(
        vodep,
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

  async pagination({ pathParameters }) {
    try {
      await isRequired(pathParameters.page, 400);
      await isRequired(pathParameters.sessionId, 400);

      const videoService = new VideoService();

      const result = await videoService.paginationVideo(
        pathParameters,
        {
          PaginationVideo: useCases.Video.PaginationVideo,
        },
        serviceLocator
      );
      return successfullyRead({ data: result });
    } catch (error) {
      return handleError(error);
    }
  }
  async update() {}
}

module.exports = VideoController;
