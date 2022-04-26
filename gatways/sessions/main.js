const { AuthMiddleware, ExtractDataIfLoggedIn } = require("../../core/config/auth");
const SessionController = require("./SessionController");

const sessionController = new SessionController();
const fobridenError =  {
  statusCode: 403,
  body: JSON.stringify({ message: 'Unauthorized, token is invalid'}),
};

module.exports.create = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError;
  return await sessionController.create(authenticatePayload);
};
module.exports.findAllSession = async (event, context, ba) => {
  const data = await ExtractDataIfLoggedIn(event);
  return await sessionController.findAll(data);
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
  const data = await ExtractDataIfLoggedIn(event);
  return await sessionController.pagination(data);
};
module.exports.update = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError;
  return await sessionController.update(authenticatePayload);
};
