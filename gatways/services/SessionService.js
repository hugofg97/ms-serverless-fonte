const { ISessionService } = require("../../interfaces/ISession");

module.exports = class extends ISessionService {
  async createSession(session, { CreateSession }, serviceLocator) {
    const newSession = await CreateSession(session, serviceLocator);

    return newSession;
  }

  async checkSessionExists({ name }, { FindOneSession }, serviceLocator) {
    const sessionExists = await FindOneSession(name, serviceLocator);

    if (sessionExists) throw 409;
  }

  async findAllSessions({ FindAllSessions, FindAllVideos }, serviceLocator) {
    const allVideos = await FindAllVideos(serviceLocator);

    const allSessions = await FindAllSessions(serviceLocator);

    const showcasePerSession = allSessions.map((session) => {
      const videosOfCurrentSession = allVideos.filter((video, index) => {
        return video.sessionId == session._id;
      });

      return {
        _id: session._id,
        sessionName: session.name,
        description: session.description,
        locked: session.locked,
        videos: videosOfCurrentSession.slice(0, 5),
      };
    });

    return showcasePerSession;
  }
  async paginationSessions(
    { page },
    { PaginationSession, FindAllVideos },
    serviceLocator
  ) {
    const allVideos = await FindAllVideos(serviceLocator);

    const allSessions = await PaginationSession(page, serviceLocator);

    const showcasePerSession = allSessions.map((session) => {
      const videosOfCurrentSession = allVideos.filter((video, index) => {
        return video.sessionId == session._id;
      });

      return {
        _id: session._id,
        sessionName: session.name,
        description: session.description,
        videos: videosOfCurrentSession.slice(0, 5),
      };
    });

    return showcasePerSession;
  }
};
