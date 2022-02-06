const VideoService = require("./VideoService");
const SubscriberService = require("../subscriber/SubscriberService");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/libs/ResponseService");

class VideoController {
  constructor() {
    this.videoService = new VideoService();
    this.subscriberService = new SubscriberService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;
      const video = await this.videoService.create(
        { video: JSON.parse(body) },
      );
      return successfullyCreated({ data: video });
    } catch (error) {
      return handleError({ error });
    }
  }

  async pagination({ pathParameters, queryStringParameters }) {
    try {
      const signatureIsActive = await this.subscriberService.signatureIsActive({ ...queryStringParameters });
      let videos = await this.videoService.pagination({
        paginationSettings: { ...pathParameters, ...queryStringParameters, unlock: signatureIsActive },
      }
      );
      return successfullyRead({ data: videos });
    } catch (error) {
      console.log(error)
      return handleError(error);
    }
  }
  async like({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const video = await this.videoService.like({ ...pathParameters });
      return successfullyRead({ data: video });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async unlike({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const video = await this.videoService.unlike(pathParameters);
      return successfullyRead({ data: video });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findLikedsBySubscriber({ pathParameters, queryStringParameters }) {
    try {
      if (!pathParameters) throw 400;
      const signatureIsActive = await this.subscriberService.signatureIsActive({ ...pathParameters });
      const { videos, count } = await this.videoService.findLikedsBySubscriber(
        {
          ...pathParameters,
          ...queryStringParameters,
          unlock: signatureIsActive
        }
      );
      return successfullyRead({ data: videos, count: count });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findBestRanking({ queryStringParameters }) {
    try {

      const signatureIsActive = await this.subscriberService.signatureIsActive({ ...queryStringParameters });
      const rankedVideos = await this.videoService.findBestRanking(
        { ...queryStringParameters, unlock: signatureIsActive },
      );

      return successfullyRead({ data: rankedVideos });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
}

module.exports = VideoController;
