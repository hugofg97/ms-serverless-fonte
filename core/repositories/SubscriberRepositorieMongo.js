"use strict";

const {
  ISubscriberRepository,
  ISubscriber,
} = require("../../interfaces/ISubscriber");
const SubscriberModel = require("../schemas/subscriber");
module.exports = class extends ISubscriberRepository {
  async create({ name, lastName, document, mobilePhone, email, birthDate, password }) {
    const subscriber = await SubscriberModel.connectDb.create({
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
      address: subscriber?.address ?? {},
      cards: subscriber?.cards ?? {},
      signature: subscriber?.signature ?? {},
      password: "removed",
    });
  }
  async update({ idPg, name, mobilePhone, address, email, signature, cards, lastName, document, birthDate }) {
    console.log(idPg, name, mobilePhone, address, email, signature, cards, lastName, document, birthDate)
    const subscriber = await SubscriberModel.connectDb.update(
      { 'document': document },
      {
        idPg,
        name,
        mobilePhone,
        address,
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
      address: subscriber?.address ?? {},
      cards: subscriber?.cards ?? {},
      signature: subscriber?.signature ?? {},
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
      address: subscriber?.address ?? {},
      cards: subscriber?.cards ?? {},
      signature: subscriber?.signature ?? {},
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
        address: subscriber?.address ?? {},
        cards: subscriber?.cards ?? {},
        signature: subscriber?.signature ?? {},
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
        address: subscriber?.address ?? {},
        cards: subscriber?.cards ?? {},
        signature: subscriber?.signature ?? {},
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
        address: subscriber?.address ?? {},
        cards: subscriber?.cards ?? {},
        signature: subscriber?.signature ?? {},
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
      count: countSubscribers,
      message: "Pessoas estão conectadas à Fonte",
    };
  }
};
