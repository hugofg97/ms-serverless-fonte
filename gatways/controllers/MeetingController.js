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
  async create({ body }) {
    try {
      if (!body) throw 400;
      const { type, subscriberId, period, status } = JSON.parse(body);

      isRequired(type, 400);
      isRequired(subscriberId, 400);
      isRequired(period, 400);
      isRequired(status, 400);

      if (type != "reiki" && type != "radiestesia") throw 400;

      const meeting = new IMeeting(JSON.parse(body));

      const meetingService = new MeetingService();

      await meetingService.checkMeetingExists(
        meeting,
        {
          FindOneMeetingForTheSubscriber:
            useCases.Meeting.FindOneMeetingForTheSubscriber,
        },
        serviceLocator
      );
      const meetingsForTheSubscriber =
        await meetingService.findMeetingsForTheSubscriber(
          meeting,
          {
            FindMeetingsOfTheSubscriber:
              useCases.Meeting.FindMeetingsOfTheSubscriber,
          },
          serviceLocator
        );
      if (meetingsForTheSubscriber.length >= 2) throw 400;
      const result = await meetingService.createMeeting(
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

      const meetingService = new MeetingService();

      const meetingsForTheSubscriber =
        await meetingService.findMeetingsForTheSubscriber(
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

      const meetingService = new MeetingService();

      const meetingsForTheSubscriber = await meetingService.deleteMeeting(
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
