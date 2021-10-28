"use strict";

const {
  ISubscriberRepository,
  ISubscriber,
} = require("../../interfaces/ISubscriber");
const MongoSubscriber = require("../schemas/subscriber");

module.exports = class extends ISubscriberRepository {
  async create({ name, lastName, document, email, birthDate, password }) {
    const newUser = await MongoSubscriber.connectDb.create({
      name,
      lastName,
      email,
      document,
      birthDate,
      password,
    });

    return new ISubscriber({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      lastName: newUser.lastName,
      document: newUser.document,
      birthDate: newUser.birthDate,
      password: "removed",
    });
  }
  async update({ name, lastName, document, birthDate }) {
    const updated = await MongoSubscriber.connectDb.updateOne(
      { document: document },
      {
        name,
        lastName,
        birthDate,
      }
    );
    const subscriber = await MongoSubscriber.connectDb.findOne({
      document: document,
    });
    return new ISubscriber({
      _id: subscriber._id,
      name: subscriber.name,
      email: subscriber.email,
      lastName: subscriber.lastName,
      document: subscriber.document,
      birthDate: subscriber.birthDate,
      password: "removed",
    });
  }

  async findByDocument({ document }) {
    console.log(document);
    const subscriber = await MongoSubscriber.connectDb.findOne({
      document: document,
    });

    if (subscriber)
      return new ISubscriber({
        _id: subscriber._id,
        name: subscriber.name,
        email: subscriber.email,
        lastName: subscriber.lastName,
        document: subscriber.document,
        birthDate: subscriber.birthDate,
        password: "removed",
      });
    else return false;
  }

  async findByEmail({ email }) {
    const subscriber = await MongoSubscriber.connectDb
      .findOne({
        email: email,
      })
      .select("+password");

    if (subscriber)
      return new ISubscriber({
        _id: subscriber._id,
        name: subscriber.name,
        email: subscriber.email,
        lastName: subscriber.lastName,
        document: subscriber.document,
        birthDate: subscriber.birthDate,
        password: subscriber.password,
      });
    else return false;
  }
  async updatePassword({ document, password }) {
    const subscriber = await MongoSubscriber.connectDb.updateOne(
      { document: document },
      {
        password: password,
      }
    );
    if (subscriber) return { update_success: "Senha atualizada com sucesso" };
    else return false;
  }
  async count() {
    const countSubscribers = await MongoSubscriber.connectDb.count({
      deletedAt: null,
    });
    return {
      count: countSubscribers,
      message: "Pessoas estão conectadas à Fonte",
    };
  }
};
