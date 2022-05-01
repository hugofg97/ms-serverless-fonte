const { AuthMiddleware } = require("../../core/config/auth");
const SubscriberController = require("./SubscriberController");

const subscriberController = new SubscriberController();
const fobridenError =  {
  statusCode: 403,
  body: JSON.stringify({ message: 'Unauthorized, token is invalid'}),
};
module.exports.createSubscriber = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.create({ body, pathParameters });
};
module.exports.update = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.update(authenticatePayload);
};
module.exports.findByDocument = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.findByDocument(authenticatePayload);
};
module.exports.linkBillingCard = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.linkBillingCard(authenticatePayload);
};
module.exports.paymentAssignature = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.paymentAssignature(authenticatePayload);
};
module.exports.forgotPassword = async (event, context) => {
  const { body, pathParameters } = event;
  return await subscriberController.forgotPassword({ body, pathParameters });
};
module.exports.updatePassword = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.updatePassword(authenticatePayload);
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
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.getSignature(authenticatePayload);
};
module.exports.cancelSignature = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.cancelSignature(authenticatePayload);
};
module.exports.emailVerification = async (event, context) => {
  const { body, pathParameters,queryStringParameters } = event;
  return await subscriberController.emailVerification({ body, pathParameters, queryStringParameters });
};
module.exports.checkAccountExists = async (event, context) => {
  const { body, pathParameters,queryStringParameters } = event;
  return await subscriberController.accountExists({ body, pathParameters, queryStringParameters });
};
module.exports.updateBillingCard = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.updateBillingCard(event);
};
module.exports.updateBillingDate = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.updateBillingDate(authenticatePayload);
};
module.exports.getCardsByCustomer = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.getCardsByCustomerDocument(authenticatePayload);
};
module.exports.deleteCardByCustomer = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await subscriberController.deleteCardByCustomer(authenticatePayload);
};

// module.exports.findAllSubscriber = async (event, context) => {
//   const { body, pathParameters } = event;
//   const authenticatePayload = await AuthMiddleware(event);
//   if(!authenticatePayload) return fobridenError
//   return await subscriberController.findAll({ body, pathParameters });
// };


// module.exports.pagination = async (event, context) => {
//   const { body, pathParameters } = event;
//   return await subscriberController.pagination({ body, pathParameters });
// };

// module.exports.linkAddressBilling = async (event, context) => {
//   const authenticatePayload = await AuthMiddleware(event);
//   if(!authenticatePayload) return fobridenError
//   return await subscriberController.linkAdressBilling(authenticatePayload);
// };