const MeetingController = require("../../controllers/MeetingController");

const meetingController = new MeetingController();

module.exports.createMeeting = async (event, context) => {
  const { body, pathParameters } = event;
  return await meetingController.create({ body, pathParameters });
};
module.exports.findMeetingsOfTheSubscriber = async (event, context) => {
  const { body, pathParameters } = event;
  return await meetingController.findMeetingsOfTheSubscriber({
    body,
    pathParameters,
  });
};
module.exports.deleteMeeting = async (event, context) => {
  const { body, pathParameters } = event;
  return await meetingController.delete({
    body,
    pathParameters,
  });
};
