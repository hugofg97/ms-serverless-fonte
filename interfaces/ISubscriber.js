"use strict";
class ISubscriber {
  constructor({
    _id = null,
    idPg = null,
    name,
    lastName,
    email,
    document,
    birthDate,
    password,
    mobilePhone,
    profileImage = null,
    address = {},
    cards = {},
    signature = {},
  }) {
    this._id = _id;
    this.idPg = idPg;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.document = document;
    this.birthDate = birthDate;
    this.password = password;
    this.mobilePhone = mobilePhone;
    this.profileImage = profileImage;
    this.address = address;
    this.cards = cards;
    this.signature = signature;
  }
}

class ISubscriberRepository {
  create() {
    throw 500;
  }
  findOne() {
    throw 500;
  }
}
class ISubscriberService {}

module.exports = {
  ISubscriber,
  ISubscriberRepository,
  ISubscriberService,
};
