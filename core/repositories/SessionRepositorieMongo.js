"use strict";
const { ISessionRepository, ISession } = require("../../interfaces/ISession");
const MongoSession = require("../schemas/sessions");

module.exports = class extends ISessionRepository {
  constructor() {
    super();
  }
  async create({ name, description, locked }) {
    const mongoSession = await MongoSession.connectDb.create({
      name,
      description,
      locked,
    });
    return mongoSession;
  }
  async findAll(limit = 5) {
    const mongoSessions = await MongoSession.connectDb
      .find({ deletedAt: null })
      .limit(limit);
    return mongoSessions.map((mongoSession) => {
      return new ISession(
        mongoSession._id,
        mongoSession.name,
        mongoSession.description
      );
    });
  }
  async findByName(name) {
    const mongoSession = await MongoSession.connectDb.findOne({
      name: name,
      deletedAt: null,
    });
    if (!mongoSession) return false;
    return new ISession(
      mongoSession._id,
      mongoSession.name,
      mongoSession.description
    );
  }
  async pagination(page) {
    const skip = 5 * (page - 1);

    const mongoSessions = await MongoSession.connectDb
      .find({
        deletedAt: null,
      })
      .skip(skip)
      .limit(5);
    return mongoSessions.map((mongoSession) => {
      return new ISession({
        _id: mongoSession._id,
        name: mongoSession.name,
        description: mongoSession.description,
        locked: false,
      });
    });
  }
};
