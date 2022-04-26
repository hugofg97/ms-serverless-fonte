const { AuthMiddleware } = require("../../core/config/auth");
const MeetingController = require("./MeetingController");

const meetingController = new MeetingController();
const fobridenError = {
  statusCode: 403,
  body: JSON.stringify({ message: "Unauthorized, token is invalid" }),
};
module.exports.createMeeting = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if (!authenticatePayload) return fobridenError;
  return await meetingController.create(authenticatePayload);
};
module.exports.findMeetingsOfTheSubscriber = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if (!authenticatePayload) return fobridenError;
  return await meetingController.findMeetingsOfTheSubscriber(
    authenticatePayload
  );
};
module.exports.deleteMeeting = async (event, context) => {
  const authenticatePayload = await AuthMiddleware(event);
  if (!authenticatePayload) return fobridenError;
  return await meetingController.delete(authenticatePayload);
};
