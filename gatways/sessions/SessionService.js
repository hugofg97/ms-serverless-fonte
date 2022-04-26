const VideoService = require("../videos/VideoService");
const serviceLocator = require("../../core/config/serviceLocator");
const {
  ISessionFindByName,
  ISession,
  ISessionFindAll,
  ISessionPagination,
  ISessionCountPerTag,
} = require("./ISession");
const { IVideoPagination, IVideoCountPerSession } = require("../videos/IVideo");
const videoService = new VideoService();
module.exports = class ISessionService {
  async create({ session }) {
    const existsSession = await new ISessionFindByName(session).find(
      serviceLocator
    );
    if (existsSession)
      throw { error: 409, field: `Sessão : ${existsSession?.name}` };
    return await new ISession(session).create(serviceLocator);
  }

  async findByName({ name }) {
    const sessionExists = await new ISessionFindByName({ name }).find(
      serviceLocator
    );
    return sessionExists;
  }

  async findAll({ limit, tag, _id, isSubscriber }) {
    const allSessions = await new ISessionFindAll({ limit, tag }).find(
      serviceLocator
    );

    await this.#videosPerSession({
      isSubscriber,
      allSessions,
      subscriberId: _id,
    });
    return allSessions;
  }
  async countPerTag({ tag }) {
    return await new ISessionCountPerTag({ tag }).count(serviceLocator);
  }
  async pagination({ tag, page, _id, isSubscriber }) {
    const allSessions = await new ISessionPagination({
      page: page,
      tag: tag,
    }).paginaiton(serviceLocator);
    
    await this.#videosPerSession({
      isSubscriber,
      allSessions,
      subscriberId:_id,
    });

    return allSessions;
  }
  async #videosPerSession({ isSubscriber, allSessions, subscriberId }) {
    for await (const [index, value] of Object.entries(allSessions)) {
      allSessions[index].videosCount = await new IVideoCountPerSession({
        sessionId: allSessions[index]._id,
      }).count(serviceLocator);
      const videos = await new IVideoPagination({
        page: 1,
        sessionId: value._id,
        limit: 10,
      }).pagination(serviceLocator);
      allSessions[index].videos = videoService.isLikedBySubscriber({
        subscriberId: subscriberId,
        videos: videos,
      });
      if (isSubscriber)
        allSessions[index].videos = videoService.unlockVideos({
          videos: videos,
        });
    }
  }
  findAllTags() {
    return ["REIKI", "DICAS", "MEDITACAO", "CURIOSIDADES", "HOME"];
  }
};
