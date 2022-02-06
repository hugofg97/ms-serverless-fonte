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
  async create({ body }) {
    try {
      if (!body) throw 400;
      const meeting = await this.service.createMeeting({meeting: JSON.parse(body)});

      return successfullyCreated({ data: meeting });
    } catch (error) {
      console.log(error)
      return handleError({ error });
    }
  }
  async findMeetingsOfTheSubscriber({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;

      const meetings = await this.service.findMeetingsForTheSubscriber(pathParameters);
      return successfullyRead({ data: meetings });
    } catch (error) {
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
