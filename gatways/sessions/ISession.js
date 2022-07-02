const { isRequired } = require("../../core/libs/validator");

class ISession {
  constructor({ _id = null, name, description, tag, videosCount = 0 }) {
    this._id = _id?? '';
    this.name = isRequired(name, 400);
    this.description = isRequired(description, 400);
    this.tag = isRequired(tag, 400);
    this.videosCount = videosCount?? 0;
  }

  async create({sessionRepository}) {
    return await sessionRepository.create({...this});
  }
  async update({sessionRepository}) {
    return await sessionRepository.update({...this});
  }
}
class ISessionFindByName {
  constructor({ name }) {
    this.name = isRequired(name, 400);
  }

  async find({sessionRepository}) {
    return await sessionRepository.findByName({...this});
  }
}
class ISessionFindAll {
  constructor({ tag, limit }) {
    this.tag = isRequired(tag, 400);
    this.limit = limit??10
  }

  async find({sessionRepository}) {
    return await sessionRepository.findAll({...this});
  }
}
class ISessionPagination {
  constructor({ tag, page }) {
    this.tag = isRequired(tag, 400);
    this.page = page??1
  }

  async paginaiton({sessionRepository}) {
    return await sessionRepository.pagination({...this});
  }
}
class ISessionCountPerTag {
  constructor({ tag }) {
    this.tag = isRequired(tag, 400);
  }

  async count({sessionRepository}) {
    return await sessionRepository.countSessionPerTag({...this});
  }
}

module.exports = {
  ISessionCountPerTag,
  ISessionPagination,
  ISessionFindAll,
  ISession,
  ISessionFindByName
};
