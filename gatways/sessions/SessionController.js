
const SessionService = require("./SessionService");
const SubscriberService = require("../subscriber/SubscriberService");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/libs/ResponseService");

class SessionController {
  constructor() {
    this.sessionService = new SessionService();
    this.subscriberService = new SubscriberService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;
      const result = await this.sessionService.create({session: JSON.parse(body)}
      );

      return successfullyCreated({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findAll({ userSession, pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      let isSubscriber = false;
      isSubscriber = await this.subscriberService.signatureIsActive({...userSession});
      const result = await this.sessionService.findAll(
        {
         ...pathParameters,
         ...userSession,
          isSubscriber: isSubscriber,
        }
      );
      const count = await this.sessionService.countPerTag({...pathParameters});
     
      return successfullyRead({ data: result, count });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async findAllTags() {
    try {
      const tags = this.sessionService.findAllTags();
      return successfullyRead({ data: tags });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }

  async pagination({ pathParameters, userSession }) {
    try {
      if(!pathParameters) throw 400;

      let isSubscriber = false;

      isSubscriber = await this.subscriberService.signatureIsActive({...userSession});
      const result = await this.sessionService.pagination(
        { ...pathParameters, ...userSession, isSubscriber}
      );
      const count = await this.sessionService.countPerTag({...pathParameters});
      return successfullyRead({ data: result, count: count });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async update() { }
}

module.exports = SessionController;
