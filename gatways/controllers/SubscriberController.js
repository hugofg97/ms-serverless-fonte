const serviceLocator = require("../../core/config/serviceLocator");
const { ISubscriber } = require("../../interfaces/ISubscriber");
const useCaseSubscriber = require("../../application/use_cases/Subscriber");
const CustomerPG = require('../pagarme/services/customers');


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
  constructor() {
    this.service = new SubscriberService();
    this.pgService = new CustomerPG();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;
      const { name, lastName, email,mobilePhone, password, document, birthDate } =
        JSON.parse(body);
      isRequired(name, 400);
      isRequired(lastName, 400);
      isRequired(email, 400);
      isRequired(password, 400);
      isRequired(mobilePhone, 400);
      isRequired(document, 400);
      isRequired(birthDate, 400);
      validateDocument(document);
      validateEmail(email);


      const subscriber = new ISubscriber(JSON.parse(body));

      let existsSubscriber = await this.service.findByDocument(
        { document: subscriber.document },
        { FindOneSubscriber: useCaseSubscriber.FindByDocument },
        serviceLocator
      );

      if (existsSubscriber) throw { error: 409, field: "Cpf" };

      existsSubscriber = await this.service.findByEmail(
        { email: subscriber.email },
        { FindOneSubscriber: useCaseSubscriber.FindByEmail },
        serviceLocator
      );
      if (existsSubscriber) throw { error: 409, field: "Email" };

      subscriber.password = await this.service.encryptPassword(subscriber);
      subscriber.email = subscriber.email.toLowerCase().trim();

      let result = await this.service.createSubscriber(
        subscriber,
        { CreateSubscriber: useCaseSubscriber.CreateSubscriber },
        serviceLocator
      );
      console.log(result);
      let pgCustomer;
      if (result) {
         pgCustomer = await this.pgService.createCustomer({
          ...result,
        });
        console.log('___________>',pgCustomer)
      }
      if(pgCustomer) {
        const { id, name, document, phones, birthdate} = pgCustomer;
        result = await this.service.updateSubscriber(
          { 
            idPg: id ,
            mobilePhone: `${phones.mobile_phone.area_code}${phones.mobile_phone.number}` ,
            name: name.split(' ')[0],
            lastName:name.split(' ')[1],
            document,
            birthDate: birthdate
          },
          { UpdateSubscriber: useCaseSubscriber.UpdateSubscriber },
          serviceLocator
        );
      }

      delete result.password;

      const token = await this.service.generateToken(result);

      return successfullyCreated({ data: { ...result, token } });
    } catch (error) {
      console.log(error)
      return handleError({ error: error });
    }
  }
  async login({ body }) {
    try {
      if (!body) throw 400;
      const { email, password } = JSON.parse(body);

      isRequired(email, 400);
      isRequired(password, 400);

      const existsSubscriber = await this.service.findByEmail(
        { email: email },
        { FindOneSubscriber: useCaseSubscriber.FindByEmail },
        serviceLocator
      );

      if (!existsSubscriber) throw 400;
      const comparePassword = await this.service.comparePassword({
        payloadPassword: password,
        password: existsSubscriber.password,
      });

      if (!comparePassword) throw 400;
      delete existsSubscriber.password;
      const token = await this.service.generateToken(existsSubscriber);

      return successfullyRead({ data: { ...existsSubscriber, token } });
    } catch (error) {
      return handleError({ error: error });
    }
  }
  async forgotPassword({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const { document } = pathParameters;

      await isRequired(document, 400);

      await validateDocument(document);

      const subscriber = await this.service.findByDocument(
        { document },
        {
          FindOneSubscriber: useCaseSubscriber.FindByDocument,
        },
        serviceLocator
      );
      if (!subscriber) throw 400;
      // const result = await this.service.sendMail(subscriber);

      return successfullyRead({ data: { codeSecurity: "BHV45" } });
    } catch (error) {
      return handleError({ error: error });
    }
  }
  async updatePassword({ body, pathParameters }) {
    try {
      if (!body) throw 400;
      const { document } = pathParameters;
      const { password } = JSON.parse(body);

      await isRequired(document, 400);
      await isRequired(password, 400);

      await validateDocument(document);

      const subscriber = await this.service.findByDocument(
        { document },
        {
          FindOneSubscriber: useCaseSubscriber.FindByDocument,
        },
        serviceLocator
      );
      if (!subscriber) throw 400;

      subscriber.password = await this.service.encryptPassword({
        password: password,
      });

      const updatedSubscriber = await this.service.updatePassword(
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
  async countSubscribers() {
    try {
      const subscriber = await this.service.countSubscribers(
        {
          CountSubscribers: useCaseSubscriber.CountSubscribers,
        },
        serviceLocator
      );

      return successfullyRead({ data: subscriber });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async findByDocument({ pathParameters }) {
    try {
      const { document } = pathParameters;
      isRequired(document);
      const existSubscriber = await this.service.findByDocument(
        { document: document },
        { FindOneSubscriber: useCaseSubscriber.FindByDocument },
        serviceLocator
      );
      if (!existSubscriber) throw 404;
      return successfullyRead({ data: existSubscriber });
    } catch (error) {
      handleError({ error: error });
    }
  }
  async update({ body, pathParameters }) {
    try {
      if (!body) throw 400;
      const { name, lastName, birthDate } = JSON.parse(body);

      isRequired(name, 400);
      isRequired(lastName, 400);
      isRequired(birthDate, 400);

      const { document } = pathParameters;

      isRequired(document);
      validateDocument(document);
      const subscriber = { ...JSON.parse(body), document: document };

      const existSubscriber = await this.service.findByDocument(
        { document: document },
        { FindOneSubscriber: useCaseSubscriber.FindByDocument },
        serviceLocator
      );
      console.log(existSubscriber);
      if (!existSubscriber) throw 404;
      const result = await this.service.updateSubscriber(
        subscriber,
        { UpdateSubscriber: useCaseSubscriber.UpdateSubscriber },
        serviceLocator
      );

      return successfullyRead({ data: result });
    } catch (error) {
      handleError({ error: error });
    }
  }

  async linkAdressBilling({ body }) {
    //.. associar telefone
    //.. associar endereço
    //.. associar cartão 
  }
  async linkCellPhone({body}) {
    
  }

};
