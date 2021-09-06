"use strict";
class ISubscriber {
  constructor({
    _id = null,
    name,
    lastName,
    email,
    document,
    birthDate,
    password,
  }) {
    this._id = _id;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.document = document;
    this.birthDate = birthDate;
    this.password = password;
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
