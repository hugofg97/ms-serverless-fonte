"use strict";

const {
  ISubscriber,
} = require("../gatways/subscriber/ISubscriber");
const SubscriberModel = require("../entitys/subscriber");
const uuid = require('uuid');
const bcrypt = require('bcrypt')
module.exports = class ISubscriberRepository {
  async create({ name, lastName, document, mobilePhone, email, birthDate, password }) {
    const salt = bcrypt.genSaltSync(10);
    const crypt =  bcrypt.hashSync(name+document, salt).substring(15,20).replace(/\./g, '-').replace(/\//g, '-');;
    const subscriber = await SubscriberModel.connectDb.create({
      _id: `${uuid.v1()}-${crypt}`,
      name,
      lastName,
      email,
      document,
      birthDate,
      password,
      mobilePhone: mobilePhone,
    })
    return new ISubscriber({
      _id: subscriber._id,
      name: subscriber.name,
      email: subscriber.email,
      lastName: subscriber.lastName,
      document: subscriber.document,
      birthDate: subscriber.birthDate,
      mobilePhone: subscriber.mobilePhone,
      profileImage: null,
      cards: subscriber?.cards ?? [],
      signature: subscriber?.signature ?? '',
      password: "removed",
    });
  }
  async update({ idPg, name, mobilePhone, signature, cards, lastName, document, birthDate }) {
    console.log("______________:")
    const subscriber = await SubscriberModel.connectDb.update(
      { 'document': document },
      {
        idPg,
        name,
        mobilePhone,
        lastName,
        signature,
        birthDate,
        cards
      }
    );
    return new ISubscriber({
      _id: subscriber._id,
      idPg: subscriber.idPg,
      name: subscriber.name,
      email: subscriber.email,
      lastName: subscriber.lastName,
      document: subscriber.document,
      birthDate: subscriber.birthDate,
      mobilePhone: subscriber?.mobilePhone ?? null,
      profileImage: subscriber?.profileImage ?? null,
      cards: subscriber?.cards ?? [],
      signature: subscriber?.signature ?? '',
      password: "removed",
    });
  }
  async setProfileImage({ document, profileImage }) {
    const subscriber = await SubscriberModel.connectDb.update(
      { 'document': document },
      {
        profileImage: profileImage,
      }
    );
    return new ISubscriber({
      _id: subscriber._id,
      idPg: subscriber.idPg,
      name: subscriber.name,
      email: subscriber.email,
      lastName: subscriber.lastName,
      document: subscriber.document,
      birthDate: subscriber.birthDate,
      mobilePhone: subscriber?.mobilePhone ?? null,
      profileImage: subscriber?.profileImage ?? null,
      cards: subscriber?.cards ?? [],
      signature: subscriber?.signature ?? '',
      password: "removed",
    });
  }

  async findByDocument({ document }) {
    const subscriber = await SubscriberModel.connectDb.get({ 'document': document })
    if (subscriber)
      return new ISubscriber({
        _id: subscriber._id,
        idPg: subscriber.idPg,
        name: subscriber.name,
        email: subscriber.email,
        lastName: subscriber.lastName,
        document: subscriber.document,
        birthDate: subscriber.birthDate,
        mobilePhone: subscriber?.mobilePhone ?? null,
        profileImage: subscriber?.profileImage ?? null,
        cards: subscriber?.cards ?? [],
        signature: subscriber?.signature ?? '',
        password: "removed",
      });
    else return false;
  }
  async findById({ subscriberId }) {
    const [subscriber] = await SubscriberModel.connectDb
      .query('_id')
      .eq(subscriberId)
      .where('deletedAt')
      .not()
      .exists()
      .exec()
    if (subscriber)
      return new ISubscriber({
        _id: subscriber._id,
        idPg: subscriber.idPg,
        name: subscriber.name,
        email: subscriber.email,
        lastName: subscriber.lastName,
        document: subscriber.document,
        birthDate: subscriber.birthDate,
        mobilePhone: subscriber?.mobilePhone ?? null,
        profileImage: subscriber?.profileImage ?? null,
        cards: subscriber?.cards ?? [],
        signature: subscriber?.signature ?? '',
        password: "removed",
      });
    else return false;
  }

  async findByEmail({ email }) {
    let [subscriber] = await SubscriberModel.connectDb
      .query('email')
      .eq(email)
      .where('deletedAt')
      .not()
      .exists()
      .exec()
    if (subscriber)
      return new ISubscriber({
        _id: subscriber._id,
        idPg: subscriber.idPg,
        profileImage: subscriber?.profileImage ?? null,
        name: subscriber.name,
        email: subscriber.email,
        lastName: subscriber.lastName,
        document: subscriber.document,
        birthDate: subscriber.birthDate,
        mobilePhone: subscriber?.mobilePhone ?? null,
        cards: subscriber?.cards ?? [],
        signature: subscriber?.signature ?? '',
        password: subscriber.password,
      });
    else return false;
  }
  async updatePassword({ document, password }) {
    const subscriber = await SubscriberModel.connectDb.update(
      { 'document': document },
      {
        password: password,
      }
    );
    if (subscriber) return { update_success: "Senha atualizada com sucesso" };
    else return false;
  }
  async count() {
    const countSubscribers = await SubscriberModel.connectDb
      .scan()
      .where('deletedAt')
      .not()
      .exists()
      .count()
      .exec()
    return {
      count: countSubscribers?.count,
      message: "Pessoas estão conectadas à Fonte",
    };
  }
};
