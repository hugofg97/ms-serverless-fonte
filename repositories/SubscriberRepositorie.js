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
      name,
      lastName,
      email,
      document,
      birthDate,
      password,
      mobilePhone: mobilePhone,
    })
    console.log("CRIACAO:", subscriber)
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
  async update({ idPg, name, mobilePhone, signature, cards, lastName, document, birthDate, _id }) {
    console.log(_id)
    const subscriber = await SubscriberModel.connectDb.update(
      {'_id': _id},
      {
        idPg,
        name,
        document,
        mobilePhone,
        lastName,
        signature,
        birthDate,
      }
    );
    console.log(subscriber)
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
  async delete({ _id }) {
    console.log('<<<', _id)
    const subscriber = await SubscriberModel.connectDb.update(
      {'_id': _id},
      {
        name: '',
        password: '',
        document: 'deleted',
        email: 'deleted',
        profileImage: '',
        mobilePhone:'',
        lastName:'',
        birthDate: '',
        deletedAt: new Date().getTime()
      }
    );
    console.log('>>>>', subscriber)
    if(subscriber)
    return { message: 'Usuário deletado com sucesso'};
    else return  {message: 'Erro ao deletar usuário'}
  }
  async setProfileImage({ _id, profileImage }) {
    const subscriber = await SubscriberModel.connectDb.update(
      { '_id': _id },
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
    console.log(document)
    const [subscriber] = await SubscriberModel.connectDb.query('document')
    .eq(document)
    .where('deletedAt')
    .not()
    .exists()
    .exec()
    console.log("FIND DOC", subscriber)
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
    const subscriber = await SubscriberModel.connectDb.get({_id: subscriberId})
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
      console.log("EMAIL: ", subscriber)

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
  async updatePassword({ _id, password }) {
    const subscriber = await SubscriberModel.connectDb.update(
      { '_id': _id },
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
