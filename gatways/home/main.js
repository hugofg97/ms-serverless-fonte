const {ExtractDataIfLoggedIn } = require("../../core/config/auth");
const HomeController = require("./HomeController");

const homeController = new HomeController();

module.exports.config = async (event, context) => {
  const authenticatePayload = await ExtractDataIfLoggedIn(event);
  return await homeController.loadHomeSessions(authenticatePayload);
};
