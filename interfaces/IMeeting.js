class IMeeting {
  constructor({
    _id = null,
    type,
    subscriberId,
    date = Date.now(),
    hour = "00:00:00",
    period = "dia",
    status = "pending",
  }) {
    this._id = _id;
    this.type = type;
    this.subscriberId = subscriberId;
    this.date = date;
    this.hour = hour;
    this.period = period;
    this.status = status;
  }
}
class IMeetingRepository {
  create(IMeeting) {
    throw 500;
  }

  update(IMeeting) {
    throw 500;
  }

  remove(meetingId) {
    throw 500;
  }

  getAll(limit) {
    throw 500;
  }

  pagination(currentPage) {
    throw 500;
  }
}
class IMeetingService {
  async findAllMeeting(event, { FindAllMeeting }, serviceLocator) {
    throw 500;
  }
  async findMeetingsOfTheSubscriber(
    event,
    { FindMeetingsOfTheSubscriber },
    serviceLocator
  ) {
    throw 500;
  }
  async paginationMeeting({ page }, { FindAllMeeting }, serviceLocator) {
    throw 500;
  }
  async crateMeeting(
    meeting,
    { FindOneMeeting, CreateMeeting },
    serviceLocator
  ) {
    throw 500;
  }
}
module.exports = {
  IMeeting,
  IMeetingRepository,
  IMeetingService,
};
