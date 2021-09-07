const { ISessionService } = require("../../interfaces/ISession");

module.exports = class extends ISessionService {
  async create(session, { CreateSession }, serviceLocator) {
    const newSession = await CreateSession(session, serviceLocator);

    return newSession;
  }

  async findByName({ name }, { FindByName }, serviceLocator) {
    const sessionExists = await FindByName(name, serviceLocator);

    if (sessionExists) throw 409;
  }

  async findAll({ FindAllSessions, FindAllVideos }, serviceLocator) {
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
  async pagination({ page }, { Pagination, FindAllVideos }, serviceLocator) {
    console.log("to inicio");
    const allVideos = await FindAllVideos(serviceLocator);
    console.log("to meio", allVideos);

    const allSessions = await Pagination(page, serviceLocator);

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
