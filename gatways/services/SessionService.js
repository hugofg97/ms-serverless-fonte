const { ISessionService } = require("../../interfaces/ISession");
const VideoService = require("../services/VideoService");

module.exports = class extends ISessionService {
  async create(session, { Create }, serviceLocator) {
    console.log("create - > ", session);
    const newSession = await Create(session, serviceLocator);

    return newSession;
  }

  async findByName({ name }, { FindByName }, serviceLocator) {
    const sessionExists = await FindByName(name, serviceLocator);

    return sessionExists;
  }

  async findAll(
    { limit, tag, subscriberId, isSubscriber },
    { FindAllSessions, PaginationVideo },
    serviceLocator
  ) {
    const allSessions = await FindAllSessions(
      { limit: limit, tag: tag },
      serviceLocator
    );

    await this.#videosPerSession({
      isSubscriber,
      allSessions,
      limit,
      subscriberId,
      PaginationVideo,
      serviceLocator,
    });
    return allSessions;
  }

  async pagination(
    { limit, tag, page, subscriberId,isSubscriber },
    { Pagination, PaginationVideo },
    serviceLocator
  ) {
    const allSessions = await Pagination(
      { page: page, tag: tag },
      serviceLocator
    );

    await this.#videosPerSession({
      isSubscriber,
      allSessions,
      subscriberId,
      PaginationVideo,
      serviceLocator,
    });

    return allSessions;
  }
  async #videosPerSession({
    limit,
    isSubscriber,
    allSessions,
    subscriberId,
    PaginationVideo,
    serviceLocator,
  }) {
    const videoService = new VideoService();

    for await (const [index, value] of Object.entries(allSessions)) {
      const videos = await PaginationVideo(
        {
          page: 1,
          sessionId: value._id,
          limit: 10,
        },
        serviceLocator
      );
      allSessions[index].videos = videoService.isLikedBySubscriber({
        subscriberId: subscriberId,
        videos: videos,
      });
      if(isSubscriber) allSessions[index].videos = videoService.unlockVideos({videos: videos});
    }
  }
  findAllTags() {
    return ["REIKI", "DICAS", "MEDITACAO", "CURIOSIDADES", "HOME"];
  }
};
