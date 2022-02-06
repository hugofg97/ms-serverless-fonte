const SubscriberController = require("./SubscriberController");

const subscriberController = new SubscriberController();

module.exports.createSubscriber = async (event, context) => {
  const { body, pathParameters } = event;
  const result = await subscriberController.create({ body, pathParameters });

  return result;
};
module.exports.findAllSubscriber = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.findAll({ body, pathParameters });
};
module.exports.pagination = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.pagination({ body, pathParameters });
};
module.exports.update = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.update({ body, pathParameters });
};
module.exports.findByDocument = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.findByDocument({ body, pathParameters });
};
module.exports.linkAddressBilling = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.linkAdressBilling({ body, pathParameters });
};
module.exports.linkBillingCard = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.linkBillingCard({ body, pathParameters });
};
module.exports.paymentAssignature = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.paymentAssignature({ body, pathParameters });
};
module.exports.forgotPassword = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.forgotPassword({ body, pathParameters });
};
module.exports.updatePassword = async (event, context) => {
  const { body, pathParameters } = event;

  return await subscriberController.updatePassword({ body, pathParameters });
};
module.exports.login = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.login({ body, pathParameters });
};
module.exports.countSubscribers = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.countSubscribers({ body, pathParameters });
};
module.exports.getSignature = async (event, context) => {
  const { body, pathParameters,queryStringParameters } = event;
  return await subscriberController.getSignature({ body, pathParameters, queryStringParameters });
};
