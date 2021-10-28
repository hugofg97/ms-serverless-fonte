module.exports.Create = ({ name, description, tag }, { sessionRepository }) => {
  return sessionRepository.create({ name, description, tag });
};

module.exports.FindAll = (query, { sessionRepository }) => {
  return sessionRepository.findAll(query);
};
module.exports.FindByName = (name, { sessionRepository }) => {
  return sessionRepository.findByName(name);
};

module.exports.Pagination = (query, { sessionRepository }) => {
  return sessionRepository.pagination(query);
};
