"use strict";
const { ISessionRepository, ISession } = require("../../interfaces/ISession");
const MongoSession = require("../schemas/sessions");

module.exports = class extends ISessionRepository {
  constructor() {
    super();
  }
  async create({ name, description, tag }) {
    const mongoSession = await MongoSession.connectDb.create({
      name,
      description,
      tag,
    });
    return mongoSession;
  }
  async findAll({ tag, limit }) {
    const mongoSessions = await MongoSession.connectDb
      .find({ deletedAt: null, tag: tag.toUpperCase() })
      .limit(limit);
    return mongoSessions.map((mongoSession) => {
      return new ISession({
        _id: mongoSession._id,
        name: mongoSession.name,
        description: mongoSession.description,
        tag: mongoSession.tag,
      });
    });
  }
  async findByName(name) {
    const mongoSession = await MongoSession.connectDb.findOne({
      name: name,
      deletedAt: null,
    });
    if (!mongoSession) return false;
    return new ISession({
      _id: mongoSession._id,
      name: mongoSession.name,
      description: mongoSession.description,
      tag: mongoSession.tag,
    });
  }
  async pagination({ page, tag }) {
    const skip = 5 * (page - 1);

    const mongoSessions = await MongoSession.connectDb
      .find({
        deletedAt: null,
        tag: tag.toUpperCase(),
      })
      .skip(skip)
      .limit(5);
    return mongoSessions.map((mongoSession) => {
      return new ISession({
        _id: mongoSession._id,
        name: mongoSession.name,
        description: mongoSession.description,
        tag: mongoSession.tag,
      });
    });
  }
};
