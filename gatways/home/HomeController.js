const SessionService = require("../sessions/SessionService");
const VideoService = require("../videos/VideoService");
const SubscriberService = require("../subscriber/SubscriberService");
const {
  handleError,
  successfullyRead,
} = require("../../core/libs/ResponseService");

class HomeController {
  constructor() {
   this.sessionService = new SessionService();
    this.videoService = new VideoService();
    this.subscriberService = new SubscriberService();
  }

  async loadHomeSessions({ pathParameters, queryStringParameters }) {
    try {
      if (!pathParameters) throw 400;
      const isSubscriber = await this.subscriberService.signatureIsActive({...queryStringParameters});
      const sessions = await this.sessionService.findAll({...pathParameters, ...queryStringParameters, isSubscriber});

      const rankedVideos = await this.videoService.findBestRanking({...queryStringParameters, unlock: isSubscriber} );
 
      sessions.push(...rankedVideos);

      return successfullyRead({ data: sessions });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }

  async update() {}
}

module.exports = HomeController;
