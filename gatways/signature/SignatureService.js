const {
  ISignatureCustomer,
  ISignatureCustomerBillingCard,
  ISignatureDeleteBillingCardCustomer,
  ISignatureGetCustomerById,
  ISignaturePayRecurrency,
  ISignatureFindSignature,
  ISignatureFindInvoiceByCustomerId,
  ISignatureFindChargeByCustomerId,
} = require("./ISignature");
const serviceLocator = require("../../core/config/serviceLocator");

module.exports = class ISubscriberService {
  async createSubscriber({ customer }) {
    return await new ISignatureCustomer(customer).create(serviceLocator);
  }
  async createBillingCard({ card }) {
    return await new ISignatureCustomerBillingCard(card).create(serviceLocator);
  }
  async deleteBillingCard({ query }) {
    return await new ISignatureDeleteBillingCardCustomer(query).delete(
      serviceLocator
    );
  }
  async findCustomerById({ idPg }) {
    return await new ISignatureGetCustomerById({ idPg }).find(serviceLocator);
  }
  async payRecurrence({ idPg, cardId }) {
    const signature = await new ISignaturePayRecurrency({
      idPg,
      cardId,
    }).create(serviceLocator);
    const charge = await new ISignatureFindChargeByCustomerId({ idPg }).find(
      serviceLocator
    );

    let isValid = charge?.status !== "paid" && charge?.status !== "processing";
    if (isValid.length > 0) {
      signature.active = false;
      signature.invoice = fatura.data.data;
      throw 400;
    }
    signature.active = true;
    signature.invoice = charge;

    return signature;
  }
  async getSignature({ subscriptionId }) {
    return await new ISignatureFindSignature({ subscriptionId }).find(
      serviceLocator
    );
  }
  async getInvoiceByCustomer({ idPg }) {
    return await new ISignatureFindInvoiceByCustomerId({ idPg }).find(
      serviceLocator
    );
  }
  async getChargesByCustomer({ idPg }) {
    return await new ISignatureFindChargeByCustomerId({ idPg }).find(
      serviceLocator
    );
  }
};
