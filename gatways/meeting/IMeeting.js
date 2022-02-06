const { isRequired } = require("../../core/libs/validator");

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
    this._id = _id?? '';
    this.type = isRequired(type, 400);
    this.subscriberId = isRequired(subscriberId, 400);
    this.date = isRequired(date, 400);
    this.hour = isRequired(hour, 400);
    this.period = isRequired(period, 400);
    this.status = isRequired(status, 400);
  }
  async create({meetingRepository}) {
    return await meetingRepository.create({...this});
  }
}
class IMeetingFindByIdSubscriber {
  constructor({
    subscriberId

  }) {
 this.subscriberId = isRequired(subscriberId, 400);
  }

  async find({meetingRepository}) {
    return await meetingRepository.findPerSubscriberId({...this});
  }
}
class IMeetingScheduledForSubscriber {
  constructor({
    subscriberId,
    type

  }) {
 this.subscriberId = isRequired(subscriberId, 400);
 this.type = isRequired(type, 400);
  }

  async find({meetingRepository}) {
    return await meetingRepository.findOnePerSubscriber({...this});
  }
}
class IMeetingDelete {
  constructor({
    meetingId,


  }) {
 this.meetingId = isRequired(meetingId, 400);

  }

  async delete({meetingRepository}) {
    return await meetingRepository.delete({...this});
  }
}
module.exports = {
  IMeetingDelete,
  IMeetingScheduledForSubscriber,
  IMeeting,
  IMeetingFindByIdSubscriber,
};
