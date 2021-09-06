const { ISessionService } = require("../../interfaces/ISession");

module.exports = class extends ISessionService {
  async createMeeting(meeting, { CreateMeeting }, serviceLocator) {
    const newMeeting = await CreateMeeting(meeting, serviceLocator);

    return newMeeting;
  }

  async checkMeetingExists(
    { type, subscriberId },
    { FindOneMeetingForTheSubscriber },
    serviceLocator
  ) {
    const meetingExists = await FindOneMeetingForTheSubscriber(
      { type, subscriberId },
      serviceLocator
    );

    if (meetingExists) throw 409;
  }

  async findMeetingsForTheSubscriber(
    { subscriberId },
    { FindMeetingsOfTheSubscriber },
    serviceLocator
  ) {
    const allMeetings = await FindMeetingsOfTheSubscriber(
      { subscriberId: subscriberId },
      serviceLocator
    );

    return allMeetings;
  }
  async deleteMeeting({ meetingId }, { DeleteMeeting }, serviceLocator) {
    const meeting = await DeleteMeeting(
      { meetingId: meetingId },
      serviceLocator
    );

    return meeting;
  }
};
