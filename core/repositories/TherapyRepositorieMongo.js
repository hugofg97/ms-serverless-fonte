"use strict";
const { ITherapyRepository, ITherapy } = require("../../interfaces/ITherapy");
const TherapyModel = require("../schemas/therapy");

module.exports = class extends ITherapyRepository {
  constructor() {
    super();
  }
  async create({ name, description, imageUrl }) {
    const therapy = await TherapyModel.connectDb.create({
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
  async findByName(name) {
    const [therapy] = await TherapyModel.connectDb
    .query('name')
    .eq(name)
    .where('deletedAt')
    .not()
    .exists()
    .exec();
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
