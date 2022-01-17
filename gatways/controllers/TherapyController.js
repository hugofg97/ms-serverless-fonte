const useCases = require("../../application/use_cases/main");
const serviceLocator = require("../../core/config/serviceLocator");
const TherapyService = require("../services/TherapyService");
const { ITherapy } = require("../../interfaces/ITherapy");
const { isRequired } = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/config/libs/ResponseService");

class TherapyController {
  constructor() {
    this.service = new TherapyService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;
      const { name, description, imageUrl } = JSON.parse(body);

      isRequired(name, 400);
      isRequired(description, 400);
      isRequired(imageUrl, 400);

      const therapy = new ITherapy(JSON.parse(body));

      const { FindByName, Create } = useCases.Therapy;

      await this.service.findByName(
        therapy,
        {
          FindByName,
        },
        serviceLocator
      );

      const result = await this.service.create(
        therapy,
        {
          Create,
        },
        serviceLocator
      );

      return successfullyCreated({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findAll({ queryStringParameters }) {
    try {

      const subscriberId = queryStringParameters?.subscriberId ?? "";

      const { FindAll } = useCases.Therapy;
      const result = await this.service.findAll({ FindAll }, serviceLocator);

      const therapy = await this.service.checkMeetingInTherapy(
        {
          FindAll: useCases.Meeting.FindMeetingsOfTheSubscriber,
          subscriberId: subscriberId,
          therapys: result,
        },
        serviceLocator
      );

      return successfullyRead({ data: therapy });
    } catch (error) {
      console.log(error);
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

module.exports = TherapyController;
