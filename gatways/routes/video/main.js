const VideoController = require("../../controllers/VideoController");
const jwt = require("jsonwebtoken");

const videoController = new VideoController();

module.exports.create = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.create({ body, pathParameters });
};
module.exports.findAllVideo = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.findAll({ body, pathParameters });
};
module.exports.pagination = async (event, context) => {
  const { body, pathParameters, queryStringParameters } = event;
  return await videoController.pagination({
    body,
    pathParameters,
    queryStringParameters,
  });
};
module.exports.like = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.like({ body, pathParameters });
};
module.exports.unlike = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.unlike({ body, pathParameters });
};
module.exports.update = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.update({ body, pathParameters });
};
module.exports.likedBySubscriber = async (event, context) => {
  const { body, pathParameters, queryStringParameters } = event;
  return await videoController.findLikedsBySubscriber({ body, pathParameters,queryStringParameters });
};
module.exports.findBestRankVideos = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.findBestRanking({ body, pathParameters });
};
