"use strict";
const { IMeeting, IMeetingRepository } = require("../../interfaces/IMeeting");
const MeetingModel = require("../schemas/meeting");
const uuid = require('uuid');
const bcrypt = require('bcrypt')
module.exports = class extends IMeetingRepository {
  constructor() {
    super();
  }
  async create({ type, subscriberId, date, hour, period, status }) {
    const salt = bcrypt.genSaltSync(10);
    const crypt =  bcrypt.hashSync(type+subscriberId, salt).substring(15,20).replace(/\./g, '-').replace(/\//g, '-');;
    const meeting = await MeetingModel.connectDb.create({
      _id: `${uuid.v1()}-${crypt}`,
      type,
      subscriberId,
      date: date.toString(),
      hour,
      period,
      status,
    });
    return new IMeeting({
      _id: meeting._id,
      type: meeting.type,
      subscriberId: meeting.subscriberId,
      date: meeting.date,
      hour: meeting.hour,
      period: meeting.period,
      status: meeting.status,
    });
  }
  async FindAllMeeting(limit = 5) {
    const meetings = await MeetingModel.connectDb
      .scan()
      .where('deletedAt')
      .not()
      .exists()
      .limit(limit).exec();
    return meetings.map((meeting) => {
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
    console.log(subscriberId)
    const meetings = await MeetingModel.connectDb
      .query('subscriberId')
      .eq(subscriberId)
      .where('deletedAt')
      .not()
      .exists()
      .exec();
    console.log(meetings)
    if (!meetings) return false;

    return meetings.map((meeting) => {
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
    const meeting = await MeetingModel.connectDb.update(
      {
        _id: meetingId
      },
      { status: "canceled", deletedAt: Date.now() }
    );

    if (!meeting)
      return { information_of_success: "Consulta já estava cancelada" };
    return { update_success: "Consulta cancelada com sucesso" };
  }
  async findOnePerSubscriber({ type, subscriberId }) {
    const [meeting] = await MeetingModel.connectDb
      .query('subscriberId')
      .eq(subscriberId)
      .and()
      .where('type')
      .eq(type)
      .exec();
    if (!meeting) return false;
    return new IMeeting({
      _id: meeting._id,
      type: meeting.type,
      subscriberId: meeting.subscriberId,
      date: meeting.date,
      hour: meeting.hour,
      period: meeting.period,
      status: meeting.status,
    });
  }
  async pagination(page) {
    const skip = 5 * (page - 1);

    const meeting = await MeetingModel.connectDb
      .find({
        deletedAt: null,
      })
      .skip(skip)
      .limit(5);
    return meeting.map((meeting) => {
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
