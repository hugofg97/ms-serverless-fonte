module.exports.CreateSubscriber = (
  { name, lastName, email,mobilePhone, document, birthDate, password },
  { subscriberRepository }
) => {
  return subscriberRepository.create({
    name,
    lastName,
    email,
    mobilePhone,
    document,
    birthDate,
    password,
  });
};
module.exports.UpdateSubscriber = (
  { idPg = null, name, lastName, document, mobilePhone, address = {},cards = {}, signature = {}, birthDate, password },
  { subscriberRepository }
) => {
  return subscriberRepository.update({
    idPg,
    name,
    mobilePhone,
    address,
    cards,
    signature,
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
