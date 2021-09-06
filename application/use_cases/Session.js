module.exports.CreateSession = (
  { name, description, locked },
  { sessionRepository }
) => {
  return sessionRepository.create({ name, description, locked });
};

module.exports.FindAllSessions = ({ sessionRepository }) => {
  return sessionRepository.getAll();
};
module.exports.FindOneSession = (name, { sessionRepository }) => {
  return sessionRepository.findOne(name);
};

module.exports.PaginationSession = (page, { sessionRepository }) => {
  return sessionRepository.pagination(page);
};
