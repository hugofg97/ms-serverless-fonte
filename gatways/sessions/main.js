const SessionController = require("./SessionController");

const sessionController = new SessionController();

module.exports.create = async (event, context) => {
  const { body, pathParameters } = event;
  return await sessionController.create({ body, pathParameters });
};
module.exports.findAllSession = async (event, context, ba) => {
  console.log(event, context, ba)
  const { body, pathParameters, queryStringParameters } = event;
  return await sessionController.findAll({
    body,
    pathParameters,
    queryStringParameters,
  });
};
module.exports.findAllTags = async (event, context) => {
  const { body, pathParameters, queryStringParameters } = event;
  return await sessionController.findAllTags({
    body,
    pathParameters,
    queryStringParameters,
  });
};
module.exports.pagination = async (event, context) => {
  const { body, pathParameters, queryStringParameters } = event;
  return await sessionController.pagination({
    body,
    pathParameters,
    queryStringParameters,
  });
};
module.exports.update = async (event, context) => {
  const { body, pathParameters } = event;
  return await sessionController.update({ body, pathParameters });
};
