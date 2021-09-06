const SessionController = require("../../controllers/SessionController");

const sessionController = new SessionController();

module.exports.createSession = async (event, context) => {
  const { body, pathParameters } = event;
  return await sessionController.create({ body, pathParameters });
};
module.exports.findAllSession = async (event, context) => {
  const { body, pathParameters } = event;
  return await sessionController.findAll({ body, pathParameters });
};
module.exports.pagination = async (event, context) => {
  const { body, pathParameters } = event;
  return await sessionController.pagination({ body, pathParameters });
};
module.exports.update = async (event, context) => {
  const { body, pathParameters } = event;
  return await sessionController.update({ body, pathParameters });
};
