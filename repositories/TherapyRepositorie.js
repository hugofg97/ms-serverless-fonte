"use strict";
const {  ITherapy } = require("../gatways/therapy/ITherapy");
const TherapyModel = require("../entitys/therapy");
const uuid = require('uuid');
const bcrypt = require('bcrypt')
module.exports = class ITherapyRepository {

  async create({ name, description, imageUrl }) {
    const salt = bcrypt.genSaltSync(10);
    const crypt =  bcrypt.hashSync(name+description, salt).substring(15,20).replace(/\./g, '-').replace(/\//g, '-');;
    const therapy = await TherapyModel.connectDb.create({
      _id: `${uuid.v1()}-${crypt}`,
      name,
      description,
      imageUrl,
    });

    return new ITherapy({
      _id: therapy._id,
      name: therapy.name,
      description: therapy.description,
      imageUrl: therapy.imageUrl,
    });
  }
  async findAll(limit = 5) {
    const therapys = await TherapyModel.connectDb
      .scan()
      .where('deletedAt')
      .not()
      .exists()
      .limit(limit)
      .exec();
    return therapys.map((therapy) => {
      return new ITherapy({
        _id: therapy._id,
        name: therapy.name,
        description: therapy.description,
        imageUrl: therapy.imageUrl,
      });
    });
  }
  async findByName({name}) {
    const [therapy] = await TherapyModel.connectDb
    .query('name')
    .eq(name)
    .exec();
    console.log(therapy)
    if (!therapy) return false;
    return new ITherapy({
      _id: therapy._id,
      name: therapy.name,
      description: therapy.description,
      imageUrl: therapy.imageUrl,
    });
  }
  async pagination(page) {
    const skip = 5 * (page - 1);

    const therapys = await TherapyModel.connectDb
      .find({
        deletedAt: null,
      })
      .skip(skip)
      .limit(5);
    return therapys.map((therapy) => {
      return new ITherapy({
        _id: therapy._id,
        name: therapy.name,
        description: therapy.description,
        imageUrl: therapy.imageUrl,
      });
    });
  }
};
