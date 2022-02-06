const serviceLocator = require("../../core/config/serviceLocator");
const { IMeetingScheduledForSubscriber, IMeetingFindByIdSubscriber, IMeeting, IMeetingDelete } = require("./IMeeting");

module.exports = class IMeetingService {
  async createMeeting({meeting}) {
    if(await new IMeetingScheduledForSubscriber({...meeting}).find(serviceLocator)) throw {error: 409, field: 'Encontro marcado no sistema'};
    const meetingsForSubscriber = await new IMeetingFindByIdSubscriber(meeting).find(serviceLocator)
    if(meetingsForSubscriber.length >= 2) throw {error: 409, field: 'Usuário ja possui 2 consultas marcadas'};
    const newMeeting = await new IMeeting(meeting).create(serviceLocator);

    return newMeeting;
  }

  async checkMeetingExists(
    { type, subscriberId }
  ) {
    const meetingExists = await new IMeetingScheduledForSubscriber( { type, subscriberId } ).find(serviceLocator);

    if (meetingExists) throw 409;
  }
  async findMeetingsForTheSubscriber( { subscriberId }) {
    const allMeetings = await new IMeetingFindByIdSubscriber( { subscriberId } ).find(serviceLocator);

    return allMeetings;
  }
  async deleteMeeting({ meetingId }) {
    const meeting = await new IMeetingDelete( { meetingId }).delete(serviceLocator);

    return meeting;
  }
};
