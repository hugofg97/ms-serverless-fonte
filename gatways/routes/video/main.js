const VideoController = require("../../controllers/VideoController");

const videoController = new VideoController();

module.exports.createVideo = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.create({ body, pathParameters });
};
module.exports.findAllVideo = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.findAll({ body, pathParameters });
};
module.exports.pagination = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.pagination({ body, pathParameters });
};
module.exports.update = async (event, context) => {
  const { body, pathParameters } = event;
  return await videoController.update({ body, pathParameters });
};
