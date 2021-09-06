const serviceLocator = require("../../core/config/serviceLocator");
const { ISubscriber } = require("../../interfaces/ISubscriber");
const useCaseSubscriber = require("../../application/use_cases/Subscriber");
const {
  createCustomer,
} = require("../../core/config/libs/payment/pagarme/apis/customers");

const {
  isRequired,
  validateDocument,
  validateEmail,
} = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyRead,
  successfullyCreated,
} = require("../../core/config/libs/ResponseService");

const SubscriberService = require("../services/SubscriberService");

module.exports = class Subscriber {
  async create({ body }) {
    try {
      const subscriberService = new SubscriberService();
      if (!body) throw 400;
      const { name, lastName, email, password, document, birthDate } =
        JSON.parse(body);

      isRequired(name, 400);
      isRequired(lastName, 400);
      isRequired(email, 400);
      isRequired(password, 400);
      isRequired(document, 400);
      isRequired(birthDate, 400);
      validateDocument(document);
      validateEmail(email);

      const subscriber = new ISubscriber(JSON.parse(body));

      let existsSubscriber = await subscriberService.findByDocument(
        { document: subscriber.document },
        { FindOneSubscriber: useCaseSubscriber.FindByDocument },
        serviceLocator
      );

      if (existsSubscriber) throw 409;

      existsSubscriber = await subscriberService.findByEmail(
        { email: subscriber.email },
        { FindOneSubscriber: useCaseSubscriber.FindByEmail },
        serviceLocator
      );

      if (existsSubscriber) throw 409;

      subscriber.password = await subscriberService.encryptPassword(subscriber);
      subscriber.email = subscriber.email.toLowerCase().trim();

      const result = await subscriberService.createSubscriber(
        subscriber,
        { CreateSubscriber: useCaseSubscriber.CreateSubscriber },
        serviceLocator
      );
      if (result)
        await createCustomer({
          ...result,
          name: `${result.name} ${result.lastName}`,
        });

      delete result.password;

      const token = await subscriberService.generateToken(result);

      return successfullyCreated({ data: { ...result, token } });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async login({ body }) {
    try {
      const subscriberService = new SubscriberService();

      if (!body) throw 400;
      const { email, password } = JSON.parse(body);

      isRequired(email, 400);
      isRequired(password, 400);

      const existsSubscriber = await subscriberService.findByEmail(
        { email: email },
        { FindOneSubscriber: useCaseSubscriber.FindByEmail },
        serviceLocator
      );

      if (!existsSubscriber) throw 400;

      const comparePassword = await subscriberService.comparePassword({
        payloadPassword: password,
        password: existsSubscriber.password,
      });

      if (!comparePassword) throw 400;
      delete existsSubscriber.password;
      const token = await subscriberService.generateToken(existsSubscriber);

      return successfullyRead({ data: { ...existsSubscriber, token } });
    } catch (error) {
      return handleError({ error: error });
    }
  }
  async forgotPassword({ pathParameters }) {
    try {
      const subscriberService = new SubscriberService();
      if (!pathParameters) throw 400;
      const { document } = pathParameters;

      await isRequired(document, 400);

      await validateDocument(document);

      const subscriber = await subscriberService.findByDocument(
        { document },
        {
          FindOneSubscriber: useCaseSubscriber.FindByDocument,
        },
        serviceLocator
      );
      if (!subscriber) throw 400;
      // const result = await subscriberService.sendMail(subscriber);

      return successfullyRead({ data: { codeSecurity: "BHV45" } });
    } catch (error) {
      return handleError({ error: error });
    }
  }
  async updatePassword({ body, pathParameters }) {
    try {
      const subscriberService = new SubscriberService();

      if (!body) throw 400;
      const { document } = pathParameters;
      const { password } = JSON.parse(body);

      await isRequired(document, 400);
      await isRequired(password, 400);

      await validateDocument(document);

      const subscriber = await subscriberService.findByDocument(
        { document },
        {
          FindOneSubscriber: useCaseSubscriber.FindByDocument,
        },
        serviceLocator
      );
      if (!subscriber) throw 400;

      subscriber.password = await subscriberService.encryptPassword({
        password: password,
      });

      const updatedSubscriber = await subscriberService.updatePassword(
        subscriber,
        { UpdatePassword: useCaseSubscriber.UpdatePassword },
        serviceLocator
      );

      return successfullyRead({ data: updatedSubscriber });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
};
