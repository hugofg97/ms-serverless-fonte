class ITherapy {
  constructor({ _id = null, name, description, imageUrl }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}
class ITherapyRepository {
  create(ITherapy) {
    throw 500;
  }
  findByName(ITherapy) {
    throw 500;
  }

  update(ITherapy) {
    throw 500;
  }

  remove(meetingId) {
    throw 500;
  }

  findAll(limit) {
    throw 500;
  }

  pagination(currentPage) {
    throw 500;
  }
}
class ITherapyService {
  async findAll(event, { FindAll }, serviceLocator) {
    throw 500;
  }
  async findByName(event, { FindByName }, serviceLocator) {
    throw 500;
  }
  async pagination({ page }, { Pagination }, serviceLocator) {
    throw 500;
  }
  async create(meeting, { Create }, serviceLocator) {
    throw 500;
  }
}
module.exports = {
  ITherapy,
  ITherapyRepository,
  ITherapyService,
};
