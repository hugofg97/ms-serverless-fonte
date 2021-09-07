"use strict";
const { ITherapyRepository, ITherapy } = require("../../interfaces/ITherapy");
const MongoTherapy = require("../schemas/therapy");

module.exports = class extends ITherapyRepository {
  constructor() {
    super();
  }
  async create({ name, description, imageUrl }) {
    const mongoTherapy = await MongoTherapy.connectDb.create({
      name,
      description,
      imageUrl,
    });

    return new ITherapy({
      _id: mongoTherapy._id,
      name: mongoTherapy.name,
      description: mongoTherapy.description,
      imageUrl: mongoTherapy.imageUrl,
    });
  }
  async findAll(limit = 5) {
    const mongoTherapys = await MongoTherapy.connectDb
      .find({ deletedAt: null })
      .limit(limit);
    return mongoTherapys.map((mongoTherapy) => {
      return new ITherapy({
        _id: mongoTherapy._id,
        name: mongoTherapy.name,
        description: mongoTherapy.description,
        imageUrl: mongoTherapy.imageUrl,
      });
    });
  }
  async findByName(name) {
    const mongoTherapy = await MongoTherapy.connectDb.findOne({
      name: name,
      deletedAt: null,
    });
    if (!mongoTherapy) return false;
    return new ITherapy({
      _id: mongoTherapy._id,
      name: mongoTherapy.name,
      description: mongoTherapy.description,
      imageUrl: mongoTherapy.imageUrl,
    });
  }
  async pagination(page) {
    const skip = 5 * (page - 1);

    const mongoTherapys = await MongoTherapy.connectDb
      .find({
        deletedAt: null,
      })
      .skip(skip)
      .limit(5);
    return mongoTherapys.map((mongoTherapy) => {
      return new ITherapy({
        _id: mongoTherapy._id,
        name: mongoTherapy.name,
        description: mongoTherapy.description,
        imageUrl: mongoTherapy.imageUrl,
      });
    });
  }
};
