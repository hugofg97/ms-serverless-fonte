module.exports.Create = (
  { name, description, locked },
  { sessionRepository }
) => {
  return sessionRepository.create({ name, description, locked });
};

module.exports.FindAll = ({ sessionRepository }) => {
  return sessionRepository.findAll();
};
module.exports.FindByName = (name, { sessionRepository }) => {
  return sessionRepository.findByName(name);
};

module.exports.Pagination = (page, { sessionRepository }) => {
  return sessionRepository.pagination(page);
};
