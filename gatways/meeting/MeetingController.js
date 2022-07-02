const MeetingService = require("./MeetingService");

const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/libs/ResponseService");

class MeetingController {
  constructor() {
    this.service = new MeetingService();
  }
  async create({ body, userSession }) {
    try {
      if (!body) throw 400;
      const meeting = await this.service.createMeeting({meeting: {...JSON.parse(body), subscriberId:userSession._id}});

      return successfullyCreated({ data: meeting });
    } catch (error) {
      console.log(error)
      return handleError({ error });
    }
  }
  async findMeetingsOfTheSubscriber({ userSession }) {
    try {
      const meetings = await this.service.findMeetingsForTheSubscriber(userSession);
      return successfullyRead({ data: meetings });
    } catch (error) {
      console.log(error)
      return handleError({ error });
    }
  }
  async delete({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const meeting = await this.service.deleteMeeting(pathParameters);
      return successfullyRead({ data: meeting });
    } catch (error) {
      return handleError({ error });
    }
  }
}

module.exports = MeetingController;
