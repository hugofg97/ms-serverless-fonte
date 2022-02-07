const {
  isRequired,
  validateDocument,
} = require("../../core/libs/validator");
const {
  handleError,
  successfullyRead,
  successfullyCreated,
} = require("../../core/libs/ResponseService");

const SubscriberService = require("./SubscriberService");

module.exports = class Subscriber {
  constructor() {
    this.service = new SubscriberService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;

      const subscriber = await this.service.createSubscriber({subscriber:JSON.parse(body)}); 
   
      return successfullyCreated({ data: subscriber });
    } catch (error) {
      console.log(error)
      return handleError({ error: error });
    }
  }
  async login({ body }) {
    try {
      if (!body) throw 400;

      const logged = await this.service.login({user: JSON.parse(body)});

      return successfullyRead({ data: logged });
    } catch (error) {
      console.log(error)
      return handleError({ error: error });
    }
  }
  async forgotPassword({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
        const requestResetPassword = await this.service.forgotPassword(pathParameters);

      return successfullyRead({ data: { codeSecurity: requestResetPassword } });
    } catch (error) {
      console.log(error)
      return handleError({ error: error });
    }
  }
  async updatePassword({ body, pathParameters }) {
    try {
      if (!body) throw 400;
     console.log(pathParameters)

      const updatedSubscriber = await this.service.updatePassword({...JSON.parse(body), ...pathParameters});

      return successfullyRead({ data: updatedSubscriber });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async countSubscribers() {
    try {
      const count = await this.service.countSubscribers();

      return successfullyRead({ data: count });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async findByDocument({ pathParameters }) {
    try {
      const existSubscriber = await this.service.findByDocument(pathParameters);
      if (!existSubscriber) throw 404;
      return successfullyRead({ data: existSubscriber });
    } catch (error) {
      return handleError({ error: error });

    }
  }
  async update({ body, pathParameters }) {
    try {
      if (!body || !pathParameters) throw 400;
      const existSubscriber = await this.service.findByDocument(pathParameters);
      if (!existSubscriber) throw 404;
      const result = await this.service.updateSubscriber(
        {...existSubscriber,...JSON.parse(body)},
      );

      return successfullyRead({ data: result });
    } catch (error) {
      return handleError({ error: error });
    }
  }

  async linkBillingCard({ body, pathParameters }) {
    try {
      if (!body) throw 400;
      const createCard = await this.service.createBillingCard({card: {...JSON.parse(body), ... pathParameters}});
      return successfullyRead({ data: createCard });

    } catch (error) {
      console.log(error)
      return handleError({ error: error });

    }
  }
  async paymentAssignature({  pathParameters }) {
    try {

      const result = await this.service.paymentAssignature({...pathParameters});

      return successfullyRead({ data: result });

    } catch (error) {
      console.log(error)
      return handleError({ error: error });

    }
  }
  async cancelSignature({ pathParameters }) {
    try {

      const result = await this.service.cancelSignature({...pathParameters});

      return successfullyRead({ data: result });

    } catch (error) {
      console.log(error)
      return handleError({ error: error });

    }
  }
  async payCharge({ pathParameters }) {
    try {

      const result = await this.service.payCharge({...pathParameters});

      return successfullyRead({ data: result });

    } catch (error) {
      console.log(error)
      return handleError({ error: error });

    }
  }
  async getSignature({pathParameters, queryStringParameters }) {
    try {

      const document = queryStringParameters?.document ?? null;


      isRequired(document, 404);

      const existsSubscriber = await this.service.findByDocument({document});

      if(!existsSubscriber) throw 404;

      const { idPg, signature} = existsSubscriber;

      if(!signature) throw 400;

      const invoicesExists = await this.service.findInvoice({idPg});
      
      if(!invoicesExists) throw 404;
 
      
      const chargesBySubscriber = await this.service.findCharge({idPg});

      if(!chargesBySubscriber) throw 404;

      invoicesExists.charge = chargesBySubscriber;
      invoicesExists.active = invoicesExists?.status === 'paid' && invoicesExists?.charge?.status === 'paid' ? true : false;
      return successfullyRead({data: invoicesExists})

    }catch(error) {
     return  handleError({error});
    }
  }
};
