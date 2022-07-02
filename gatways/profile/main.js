const ProfileController = require("./ProfileController");
const { AuthMiddleware } = require("../../core/config/auth");

const profileController = new ProfileController();
const fobridenError =  {
  statusCode: 403,
  body: JSON.stringify({ message: 'Unauthorized, token is invalid'}),
};
module.exports.support = async (event, context) => {
  const { body, pathParameters } = event;
  return await profileController.support({ body, pathParameters });
};
module.exports.privacity = async (event, context) => {
  const { body, pathParameters } = event;
  return await profileController.privacity({ body, pathParameters });
};
module.exports.profileImage = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError
  return await profileController.profileImage(authenticatePayload);
};
module.exports.dayTexts = async (event, context) => {
  const { body, pathParameters } = event;
  return await profileController.dayTexts({ body, pathParameters });
};
