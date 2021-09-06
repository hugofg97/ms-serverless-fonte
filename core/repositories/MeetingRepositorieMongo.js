"use strict";
const { IMeeting, IMeetingRepository } = require("../../interfaces/IMeeting");
const MongoMeeting = require("../schemas/meeting");

module.exports = class extends IMeetingRepository {
  constructor() {
    super();
  }
  async create({ type, subscriberId, date, hour, period, status }) {
    const mongoMeeting = await MongoMeeting.connectDb.create({
      type,
      subscriberId,
      date,
      hour,
      period,
      status,
    });
    return new IMeeting({
      _id: mongoMeeting._id,
      type: mongoMeeting.type,
      subscriberId: mongoMeeting.subscriberId,
      date: mongoMeeting.date,
      hour: mongoMeeting.hour,
      period: mongoMeeting.period,
      status: mongoMeeting.status,
    });
  }
  async FindAllMeeting(limit = 5) {
    const mongoMeeting = await MongoMeeting.connectDb
      .find({ deletedAt: null })
      .limit(limit);
    return mongoMeeting.map((meeting) => {
      return new IMeeting({
        _id: meeting._id,
        type: meeting.type,
        subscriberId: meeting.subscriberId,
        date: meeting.date,
        hour: meeting.hour,
        period: meeting.period,
        status: meeting.status,
      });
    });
  }
  async findPerSubscriberId({ subscriberId }) {
    const mongoMeeting = await MongoMeeting.connectDb.find({
      subscriberId: subscriberId,
      deletedAt: null,
    });

    if (!mongoMeeting) return false;

    return mongoMeeting.map((meeting) => {
      return new IMeeting({
        _id: meeting._id,
        type: meeting.type,
        subscriberId: meeting.subscriberId,
        date: meeting.date,
        hour: meeting.hour,
        period: meeting.period,
        status: meeting.status,
      });
    });
  }
  async delete({ meetingId }) {
    const mongoMeeting = await MongoMeeting.connectDb.updateOne(
      {
        _id: meetingId,
        deletedAt: null,
      },
      { status: "canceled", deletedAt: Date.now() }
    );

    if (!mongoMeeting)
      return { information_of_success: "Consulta já estava cancelada" };
    return { update_success: "Consulta cancelada com sucesso" };
  }
  async findOnePerSubscriber({ type, subscriberId }) {
    const mongoMeeting = await MongoMeeting.connectDb.findOne({
      subscriberId: subscriberId,
      type: type,
      deletedAt: null,
    });

    if (!mongoMeeting) return false;
    return new IMeeting({
      _id: mongoMeeting._id,
      type: mongoMeeting.type,
      subscriberId: mongoMeeting.subscriberId,
      date: mongoMeeting.date,
      hour: mongoMeeting.hour,
      period: mongoMeeting.period,
      status: mongoMeeting.status,
    });
  }
  async pagination(page) {
    const skip = 5 * (page - 1);

    const mongoMeeting = await MongoMeeting.connectDb
      .find({
        deletedAt: null,
      })
      .skip(skip)
      .limit(5);
    return mongoMeeting.map((meeting) => {
      return new IMeeting({
        _id: meeting._id,
        type: meeting.type,
        subscriberId: meeting.subscriberId,
        date: meeting.date,
        hour: meeting.hour,
        period: meeting.period,
        status: meeting.status,
      });
    });
  }
};
