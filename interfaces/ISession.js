class ISession {
  constructor({ _id = null, name, description, tag }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.tag = tag;
  }
}
class ISessionRepository {
  create(ISession) {
    throw 500;
  }

  update(ISession) {
    throw 500;
  }

  remove(sessionId) {
    throw 500;
  }

  findAll(limit) {
    throw 500;
  }

  pagination(currentPage) {
    throw 500;
  }
}
class ISessionService {
  constructor() {}
  async findAll(event, { FindAllSessions, FindAllVideos }, serviceLocator) {
    throw 500;
  }
  async pagination(
    { page },
    { FindAllSessions, FindAllVideos },
    serviceLocator
  ) {
    throw 500;
  }
  async create(session, { FindOneSession, CreateSession }, serviceLocator) {
    throw 500;
  }
}
module.exports = {
  ISession,
  ISessionRepository,
  ISessionService,
};
