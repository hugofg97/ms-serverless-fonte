module.exports.Create = (
  { name, description, imageUrl },
  { therapyRepository }
) => {
  return therapyRepository.create({ name, description, imageUrl });
};

module.exports.FindAll = ({ therapyRepository }) => {
  return therapyRepository.findAll();
};
module.exports.FindByName = (name, { therapyRepository }) => {
  return therapyRepository.findByName(name);
};

module.exports.Pagination = (page, { therapyRepository }) => {
  return therapyRepository.pagination(page);
};
