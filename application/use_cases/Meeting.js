module.exports.CreateMeeting = (
  { type, subscriberId, date, hour, period, status },
  { meetingRepository }
) => {
  return meetingRepository.create({
    type,
    subscriberId,
    date,
    hour,
    period,
    status,
  });
};

module.exports.FindMeetingsOfTheSubscriber = (
  { subscriberId },
  { meetingRepository }
) => {
  return meetingRepository.findPerSubscriberId({ subscriberId });
};
module.exports.FindOneMeetingForTheSubscriber = (
  { subscriberId, type },
  { meetingRepository }
) => {
  return meetingRepository.findOnePerSubscriber({
    subscriberId: subscriberId,
    type: type,
  });
};
module.exports.DeleteMeeting = ({ meetingId }, { meetingRepository }) => {
  return meetingRepository.delete({
    meetingId: meetingId,
  });
};
module.exports.FindAllMeeting = ({ meetingRepository }) => {
  return meetingRepository.findAll();
};

module.exports.PaginationMeeting = (page, { meetingRepository }) => {
  return meetingRepository.pagination(page);
};
