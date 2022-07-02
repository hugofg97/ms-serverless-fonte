const { isRequired, validateDocument } = require("../../core/libs/validator");
const {
  handleError,
  successfullyRead,
  successfullyCreated,
  successfullyReadCipher,
} = require("../../core/libs/ResponseService");

const SubscriberService = require("./SubscriberService");

module.exports = class Subscriber {
  constructor() {
    this.service = new SubscriberService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;
      const subscriber = await this.service.createSubscriber({
        subscriber: JSON.parse(body),
      });

      return successfullyCreated({ data: subscriber });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async login({ body }) {
    try {
      if (!body) throw 400;

      const logged = await this.service.login({ user: JSON.parse(body) });
      return successfullyRead({ data: logged });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async forgotPassword({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const requestResetPassword = await this.service.forgotPassword(
        pathParameters
      );

      return successfullyRead({ data: { codeSecurity: requestResetPassword } });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async emailVerification({ pathParameters }) {
    try {
      if (!pathParameters) throw 400;
      const requestEmailVerification = await this.service.emailVerification(
        pathParameters
      );

      return successfullyRead({
        data: { codeSecurity: requestEmailVerification },
      });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async updatePassword({ body, pathParameters }) {
    try {
      if (!body) throw 400;

      const updatedSubscriber = await this.service.updatePassword({
        ...JSON.parse(body),
        ...pathParameters,
      });

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
  async accountExists({ body }) {
    try {
      const checkAccountExists = await this.service.checkAccountExists({
        user: { ...JSON.parse(body) },
      });
      return successfullyRead({ data: checkAccountExists });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async findByDocument({ userSession }) {
    try {
      const existSubscriber = await this.service.findByDocument(userSession);
      if (!existSubscriber) throw 404;
      return successfullyRead({ data: existSubscriber });
    } catch (error) {
      return handleError({ error: error });
    }
  }

  async deleteSubscriber({ userSession }) {
    try {
      console.log(userSession)
      const deletedSubscriber = await this.service.deleteSubscriber(userSession);
      return successfullyRead({ data: deletedSubscriber });
    } catch (error) {
      return handleError({ error: error });
    }
  }

  async update({ body, userSession }) {
    try {
      if (!body) throw 400;
      const existSubscriber = await this.service.findByDocument(userSession);
      if (!existSubscriber) throw 404;
      const result = await this.service.updateSubscriber({
        subscriber: { ...existSubscriber, ...JSON.parse(body) },
      });
      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error)
      return handleError({ error: error });
    }
  }

  async linkBillingCard({ body, userSession }) {
    try {
      if (!body) throw 400;
      const createCard = await this.service.createBillingCard({
        card: { ...JSON.parse(body) },
        user: userSession
      });
      return successfullyRead({ data: createCard });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async deleteCardByCustomer({ pathParameters, userSession }) {
    try {
      if (!pathParameters) throw 400;
      const deleteCard = await this.service.deleteBillingCard({...pathParameters, ...userSession})
      return successfullyRead({ data: deleteCard });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async paymentAssignature({ userSession }) {
    try {
      const result = await this.service.paymentAssignature({
        ...userSession,
      });

      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async cancelSignature({ userSession }) {
    try {
      const result = await this.service.cancelSignature({ ...userSession });

      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async payCharge({ pathParameters }) {
    try {
      const result = await this.service.payCharge({ ...pathParameters });

      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async updateBillingCard({ body, userSession }) {
    try {
      await this.service.updateBillingCard({
        ...JSON.parse(body),
        ...userSession,
      });

      return successfullyRead({ data: true });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async updateBillingDate({ body, userSession }) {
    try {
      const result = await this.service.updateBillingDate({
        ...JSON.parse(body),
        ...userSession,
      });

      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }
  async getCardsByCustomer({ userSession }) {
    try {
      const result = await this.service.getCardsByCustomer(
        userSession
      );

      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error: error });
    }
  }

  async getSignature({ userSession }) {
    try {
      const _id = userSession._id;

      isRequired(_id, 404);

      const existsSubscriber = await this.service.findById({ _id });

      if (!existsSubscriber) throw 404;

      const { idPg, signature } = existsSubscriber;

      if (!signature) throw 400;

      const signatureExists = await this.service.findSignature({ signature });
      const invoicesExists = await this.service.findInvoice({ idPg });

      if (!invoicesExists) throw 404;

      const chargesBySubscriber = await this.service.findCharge({ idPg });

      if (!chargesBySubscriber) throw 404;
      invoicesExists.card = signatureExists.card;

      delete chargesBySubscriber.last_transaction;
      invoicesExists.charge = chargesBySubscriber;
      invoicesExists.active =
        invoicesExists?.status === "paid" &&
        invoicesExists?.charge?.status === "paid"
          ? true
          : false;
    
      return successfullyReadCipher({ data:invoicesExists });
    } catch (error) {
      return handleError({ error });
    }
  }
};
