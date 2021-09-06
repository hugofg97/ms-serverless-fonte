const SubscriberController = require("../../controllers/SubscriberController");

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
