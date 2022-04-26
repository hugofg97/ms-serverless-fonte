const { AuthMiddleware } = require("../../core/config/auth");
const TherapyController = require("./TherapyController");

const therapyController = new TherapyController();

module.exports.create = async (event) => {
  const authenticatePayload = await AuthMiddleware(event);
  if (!authenticatePayload) return fobridenError;
  return await therapyController.create(authenticatePayload);
};
module.exports.findAll = async (event) => {
  const authenticatePayload = await AuthMiddleware(event);
  if (!authenticatePayload) return fobridenError;
  return await therapyController.findAll(authenticatePayload);
};
