module.exports.CreateSubscriber = (
  { name, lastName, email, document, birthDate, password },
  { subscriberRepository }
) => {
  return subscriberRepository.create({
    name,
    lastName,
    email,
    document,
    birthDate,
    password,
  });
};
module.exports.FindByDocument = ({ document }, { subscriberRepository }) => {
  return subscriberRepository.findByDocument({ document });
};
module.exports.FindByEmail = ({ email }, { subscriberRepository }) => {
  return subscriberRepository.findByEmail({ email });
};
module.exports.UpdatePassword = (
  { document, password },
  { subscriberRepository }
) => {
  return subscriberRepository.updatePassword({ document, password });
};