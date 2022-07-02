const VideoController = require("./VideoController");
const jwt = require("jsonwebtoken");
const { ExtractDataIfLoggedIn, AuthMiddleware } = require("../../core/config/auth");
const fobridenError =  {
  statusCode: 403,
  body: JSON.stringify({ message: 'Unauthorized, token is invalid'}),
};
const videoController = new VideoController();

module.exports.create = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) 
  return await videoController.create(event);
};
module.exports.pagination = async (event, context) => {
  const authenticatePayload = await ExtractDataIfLoggedIn(event);
  return await videoController.pagination(authenticatePayload);
};
module.exports.like = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError;
  return await videoController.like(authenticatePayload);
};
module.exports.unlike = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError;
  return await videoController.unlike(authenticatePayload);
};
module.exports.likedBySubscriber = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if(!authenticatePayload) return fobridenError;
  return await videoController.findLikedsBySubscriber(authenticatePayload);
};
module.exports.findBestRankVideos = async (event, context) => {
  const authenticatePayload = await ExtractDataIfLoggedIn(event);
  return await videoController.findBestRanking(authenticatePayload);
};


// module.exports.update = async (event, context) => {
//   const { body, pathParameters } = event;
//   return await videoController.update({ body, pathParameters });
// };

// module.exports.findAllVideo = async (event, context) => {
//   const { body, pathParameters } = event;
//   return await videoController.findAll({ body, pathParameters });
// };