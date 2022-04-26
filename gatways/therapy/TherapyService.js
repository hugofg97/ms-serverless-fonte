const serviceLocator = require("../../core/config/serviceLocator");
const { IMeetingRepository, IMeetingFindByIdSubscriber } = require("../meeting/IMeeting");
const {  ITherapy, ITherapyFindByName, ITherapyFindAll } = require("./ITherapy");

module.exports = class  ITherapyService {
  async create({therapy}) {
    if(await new ITherapyFindByName(therapy).find(serviceLocator)) throw { error: 409, field: `Terapia : ${therapy?.name}` };;
    return await new ITherapy(therapy).create(serviceLocator);
  }

  async findByName({ name }) {
    const therapyExists = await new ITherapyFindByName(name).find(serviceLocator);

    if (therapyExists) throw 409;
  }

  async findAll({_id}) {
    const therapys = await new ITherapyFindAll().find(serviceLocator);
    if (_id) return this.checkMeetingInTherapy({subscriberId:_id, therapys});
    return therapys.map((therapy) => {
      therapy.locked = false
      return therapy;
    })
  }
  async checkMeetingInTherapy({  subscriberId, therapys }) {
    const meetings = await new IMeetingFindByIdSubscriber({subscriberId}).find(serviceLocator);

    therapys.map((therapy) => {
      const match = meetings.filter((meeting) => meeting.type == therapy.name);
      therapy.locked = match.length ? true : false;
    });

    return therapys;
  }
};
