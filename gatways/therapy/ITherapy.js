const { isRequired } = require("../../core/libs/validator");

class ITherapy {
  constructor({ _id = null, name, description, imageUrl }) {
    this._id = _id??'';
    this.name = isRequired(name,400 );
    this.description = isRequired(description, 400);
    this.imageUrl = isRequired(imageUrl, 400);
  }
  async create({therapyRepository}) {
    return await therapyRepository.create({...this})
  }
  async update({therapyRepository}) {
    return await therapyRepository.create({...this})
  }
}
class ITherapyFindByName {
  constructor({ name }) {

    this.name = isRequired(name,400 );

  }
  async find({therapyRepository}) {
    return await therapyRepository.findByName({...this})
  }
}
class ITherapyFindAll {
  async find({therapyRepository}) {
    return await therapyRepository.findAll()
  }
}

module.exports = {
  ITherapyFindAll,
  ITherapy,
  ITherapyFindByName,
};
