const useCases = require("../../application/use_cases/main");
const serviceLocator = require("../../core/config/serviceLocator");
const VideoService = require("../services/VideoService");
const SubscriberService = require("../services/SubscriberService");
const { IVideo } = require("../../interfaces/IVideo");
const { isRequired, fildExists } = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/config/libs/ResponseService");

class VideoController {
  constructor() {
    this.service = new VideoService();
    this.subscriberService = new SubscriberService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;

      const video = new IVideo(JSON.parse(body));

      await isRequired(video.videoName, 400);
      await isRequired(video.videoDescription, 400);
      await isRequired(video.videoThumb, 400);
      await isRequired(video.videoUrl, 400);
      if(video?.locked === undefined || video?.locked === null) {
        throw 400
      }
      await isRequired(video.sessionId, 400);

      const existsVideo = await this.service.findByName(
        video,
        {
          FindByName: useCases.Video.FindByName,
        },
        serviceLocator
      );
      if(existsVideo) throw {error: 409, field: `Video : ${existsVideo?.videoName}`};
      const result = await this.service.create(
        video,
        {
          Create: useCases.Video.Create,
        },
        serviceLocator
      );
      return successfullyCreated({ data: result });
    } catch (error) {
      console.log(error)
      return handleError({ error });
    }
  }

  async pagination({ pathParameters, queryStringParameters }) {
    try {
      await isRequired(pathParameters.page, 400);
      await isRequired(pathParameters.sessionId, 400);
      const subscriberId = queryStringParameters?.subscriberId ?? "";
      const result = await this.service.pagination(
        pathParameters,
        {
          Pagination: useCases.Video.Pagination,
        },
        serviceLocator
      );

      let videos = this.service.isLikedBySubscriber({
        videos: result,
        subscriberId: subscriberId,
      });

      if(subscriberId) {

        const subscriber = await this.subscriberService.findById({subscriberId}, {FindById: useCases.Subscriber.FindById}, serviceLocator);
        if(subscriber?.signature && subscriber?.signature?.active) {
          videos = this.service.unlockVideos({videos})
        }
      }
      return successfullyRead({ data: videos });
    } catch (error) {
      return handleError(error);
    }
  }
  async like({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const { subscriberId, videoId } = pathParameters;
      isRequired(subscriberId, 400);
      isRequired(videoId, 400);
      const videoExists = await this.service.findById({videoId}, serviceLocator);
      if(!videoExists) throw 404;
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
      const videoExists = await this.service.findById({videoId}, serviceLocator);
      if(!videoExists) throw 404;
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
  async findLikedsBySubscriber({ pathParameters, queryStringParameters }) {
    try {
      const page = queryStringParameters?.page ?? 1;
      if (!pathParameters) throw 400;
      const { subscriberId } = pathParameters;
      isRequired(subscriberId, 400);
      const videos = await this.service.findLikedsBySubscriber(
        {
          subscriberId: subscriberId,
          page: page,
        },
        serviceLocator
      );
      if(subscriberId) {

        const subscriber = await this.subscriberService.findById({subscriberId}, {FindById: useCases.Subscriber.FindById}, serviceLocator);
        if(subscriber?.signature  && subscriber?.signature?.active) {
          videos = this.service.unlockVideos({videos})
        }
      }
      return successfullyRead({ data: videos });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findBestRanking({ queryStringParameters }) {
    try {
      const subscriberId = queryStringParameters?.subscriberId ?? "";
      const rankedVideos = await this.service.findBestRanking(
        { subscriberId: subscriberId },
        {
          RankedVideos: useCases.Video.RankedVideos,
        },
        serviceLocator
      );
      if(subscriberId) {

        const subscriber = await this.subscriberService.findById({subscriberId}, {FindById: useCases.Subscriber.FindById}, serviceLocator);
        if(subscriber?.signature && subscriber?.signature?.active) {
          rankedVideos = this.service.unlockVideos({videos: rankedVideos})
        }
      }
      return successfullyRead({ data: rankedVideos });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
}

module.exports = VideoController;
