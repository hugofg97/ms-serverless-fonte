const { IVideoService } = require("../../interfaces/IVideo");

module.exports = class extends IVideoService {
  async createSession(session, { CreateSession }, serviceLocator) {
    const newSession = await CreateSession(session, serviceLocator);

    return newSession;
  }

  async checkSessionExists({ name }, { FindOneSession }, serviceLocator) {
    const sessionExists = await FindOneSession(name, serviceLocator);

    if (sessionExists) throw 409;
  }

  async paginationVideo(
    { page, sessionId },
    { PaginationVideo },
    serviceLocator
  ) {
    const allVideos = await PaginationVideo(
      { page, sessionId },
      serviceLocator
    );

    return allVideos;
  }
};
