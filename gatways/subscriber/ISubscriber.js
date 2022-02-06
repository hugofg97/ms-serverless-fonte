"use strict";

const { isRequired, validateDocument, validateEmail } = require("../../core/libs/validator");

class ISubscriber {
  constructor({
    _id,
    idPg,
    name,
    lastName,
    email,
    document,
    birthDate,
    password,
    mobilePhone,
    profileImage,
    cards,
    signature,
  }) {
    this._id = _id??'';
    this.idPg = idPg??'';
    this.name = isRequired(name, 400);
    this.lastName = isRequired(lastName,400);
    this.email = validateEmail(email);
    this.document = validateDocument(document);
    this.birthDate = isRequired(birthDate,400);
    this.password = isRequired(password, 400);
    this.mobilePhone = isRequired(mobilePhone, 400);
    this.profileImage = profileImage??'';
    this.cards = cards??'';
    this.signature = signature??'';
  }

  async create({subscriberRepository}) {
   return subscriberRepository.create({...this});
  }
  async update({subscriberRepository}) {
   return subscriberRepository.update({...this});
  }
}
class ISubscriberFindByDocument {
  constructor(
    { document },
  ) { 
    this.document = validateDocument(document);
  }

  async find({subscriberRepository}) {
   return subscriberRepository.findByDocument({...this});
  }
}
class ISubscriberFindById {
  constructor(
    { subscriberId },
  ) { 
    this.subscriberId = isRequired(subscriberId,400);
  }

  async find({subscriberRepository}) {
    console.log(this)
   return subscriberRepository.findById({...this});
  }
}
class ISubscriberFindByEmail {
  constructor({
   email
  }) {
   this.email = validateEmail(email);

  }
  async find({subscriberRepository}) {
   return subscriberRepository.findByEmail({...this});
  }
}
class ISubscriberForgotPassword {
  constructor({
   document
  }) {
   this.document = validateDocument(document);
  }
}

class ISubscriberUpdatePassword {
  constructor({
   document,
   password
  }) {
   this.document = validateDocument(document);
   this.password = isRequired(password,  400);
  }
  async update({subscriberRepository}) {
   return subscriberRepository.updatePassword({...this});
  }
}
class ISubscriberProfileImage {
  constructor({
   document,
   profileImage
  }) {
   this.document = validateDocument(document);
   this.profileImage = isRequired(profileImage,  400);
  }
  async update({subscriberRepository}) {
   return subscriberRepository.setProfileImage({...this});
  }
}

class ISubscriberAuth {
  constructor({
    email,
    password
  }) {
    this.email = validateEmail(email);
    this.password = isRequired(password, 400);
  }
}


module.exports = {
  ISubscriberForgotPassword,
  ISubscriber,
  ISubscriberAuth,
  ISubscriberFindById,
  ISubscriberFindByDocument,
  ISubscriberFindByEmail,
  ISubscriberFindByEmail,
  ISubscriberProfileImage,
  ISubscriberProfileImage,
  ISubscriberUpdatePassword

}

