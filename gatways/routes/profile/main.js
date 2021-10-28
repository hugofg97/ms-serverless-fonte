const ProfileController = require("../../controllers/ProfileController");

const profileController = new ProfileController();

module.exports.support = async (event, context) => {
  const { body, pathParameters } = event;
  return await profileController.support({ body, pathParameters });
};
module.exports.privacity = async (event, context) => {
  const { body, pathParameters } = event;
  return await profileController.privacity({ body, pathParameters });
};
