const { ITherapyService } = require("../../interfaces/ITherapy");

module.exports = class extends ITherapyService {
  async create(therapy, { Create }, serviceLocator) {
    return await Create(therapy, serviceLocator);
  }

  async findByName({ name }, { FindByName }, serviceLocator) {
    const therapyExists = await FindByName(name, serviceLocator);

    if (therapyExists) throw 409;
  }

  async findAll({ FindAll }, serviceLocator) {
    return await FindAll(serviceLocator);
  }
  async checkMeetingInTherapy(
    { FindAll, subscriberId, therapys },
    serviceLocator
  ) {
    const meetings = await FindAll(
      { subscriberId: subscriberId },
      serviceLocator
    );
    console.log(meetings);

    therapys.map((therapy) => {
      const match = meetings.filter((meeting) => meeting.type == therapy.name);
      therapy.locked = match.length ? true : false;
    });

    return therapys;
  }

  async pagination({ page }, { Pagination }, serviceLocator) {
    return await Pagination(page, serviceLocator);
  }
};
