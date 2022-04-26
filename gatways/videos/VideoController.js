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

  async pagination({ pathParameters, userSession }) {
    try {
      const signatureIsActive = await this.subscriberService.signatureIsActive({ ...userSession });
      let videos = await this.videoService.pagination({
        paginationSettings: { ...pathParameters, ...userSession, subscriberId: userSession._id, unlock: signatureIsActive },
      }
      );
      return successfullyRead({ data: videos });
    } catch (error) {
      console.log(error)
      return handleError(error);
    }
  }
  async like({ userSession, pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const video = await this.videoService.like({ ...userSession, ...pathParameters });
      return successfullyRead({ data: video });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async unlike({ userSession, pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const video = await this.videoService.unlike({ ...userSession, ...pathParameters });
      return successfullyRead({ data: video });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findLikedsBySubscriber({ userSession, queryStringParameters }) {
    try {
      const signatureIsActive = await this.subscriberService.signatureIsActive({ ...userSession });
      const { videos, count } = await this.videoService.findLikedsBySubscriber(
        {
          ...userSession,
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
  async findBestRanking({ userSession }) {
    try {

      const signatureIsActive = await this.subscriberService.signatureIsActive({ ...userSession });
      const rankedVideos = await this.videoService.findBestRanking(
        { ...userSession, unlock: signatureIsActive },
      );

      return successfullyRead({ data: rankedVideos });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
}

module.exports = VideoController;
