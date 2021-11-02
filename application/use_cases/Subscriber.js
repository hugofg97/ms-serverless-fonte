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
module.exports.UpdateSubscriber = (
  { name, lastName, document, birthDate, password },
  { subscriberRepository }
) => {
  return subscriberRepository.update({
    name,
    lastName,
    document,
    birthDate,
    password,
  });
};
module.exports.SetProfileImage = (
  { document, profileImage },
  { subscriberRepository }
) => {
  return subscriberRepository.setProfileImage({
    profileImage, document
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
module.exports.CountSubscribers = ({ subscriberRepository }) => {
  return subscriberRepository.count();
};
