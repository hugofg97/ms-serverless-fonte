const HomeController = require("./HomeController");

const homeController = new HomeController();

module.exports.config = async (event, context) => {
  const { body, pathParameters } = event;
  return await homeController.loadHomeSessions({ body, pathParameters });
};
