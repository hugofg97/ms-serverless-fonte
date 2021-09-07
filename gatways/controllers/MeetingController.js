const useCases = require("../../application/use_cases/main");
const serviceLocator = require("../../core/config/serviceLocator");
const MeetingService = require("../services/MeetingService");
const { IMeeting } = require("../../interfaces/IMeeting");
const { isRequired } = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/config/libs/ResponseService");

class MeetingController {
  constructor() {
    this.service = new MeetingService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;
      const { type, subscriberId } = JSON.parse(body);

      isRequired(type, 400);
      isRequired(subscriberId, 400);

      if (type != "reiki" && type != "radiestesia") throw 400;

      const meeting = new IMeeting(JSON.parse(body));

      this.service.checkMeetingExists(
        meeting,
        {
          FindOneMeetingForTheSubscriber:
            useCases.Meeting.FindOneMeetingForTheSubscriber,
        },
        serviceLocator
      );
      const meetingsForTheSubscriber =
        this.service.findMeetingsForTheSubscriber(
          meeting,
          {
            FindMeetingsOfTheSubscriber:
              useCases.Meeting.FindMeetingsOfTheSubscriber,
          },
          serviceLocator
        );
      if (meetingsForTheSubscriber.length >= 2) throw 400;
      const result = this.service.createMeeting(
        meeting,
        {
          CreateMeeting: useCases.Meeting.CreateMeeting,
        },
        serviceLocator
      );

      return successfullyCreated({ data: result });
    } catch (error) {
      return handleError({ error });
    }
  }
  async findMeetingsOfTheSubscriber({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;

      const { subscriberId } = pathParameters;
      isRequired(subscriberId, 400);

      const meetingsForTheSubscriber =
        this.service.findMeetingsForTheSubscriber(
          { subscriberId: subscriberId },
          {
            FindMeetingsOfTheSubscriber:
              useCases.Meeting.FindMeetingsOfTheSubscriber,
          },
          serviceLocator
        );
      return successfullyRead({ data: meetingsForTheSubscriber });
    } catch (error) {
      return handleError({ error });
    }
  }
  async delete({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;

      const { meetingId } = pathParameters;
      isRequired(meetingId, 400);

      const meetingsForTheSubscriber = this.service.deleteMeeting(
        { meetingId: meetingId },
        {
          DeleteMeeting: useCases.Meeting.DeleteMeeting,
        },
        serviceLocator
      );
      return successfullyRead({ data: meetingsForTheSubscriber });
    } catch (error) {
      return handleError({ error });
    }
  }
}

module.exports = MeetingController;
