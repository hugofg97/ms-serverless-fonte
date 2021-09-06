const { createPath, pagarmeConnect } = require("../config/pagarmeConection");

module.exports.createCustomer = async ({
  _id,
  name,
  email,
  document,
  birthDate,
}) => {
  try {
    const payload = {
      external_id: "613421c13376580d4961c90b",
      name: "pietro",
      type: "individual",
      country: "br",
      email: "pietrodtyus@gmail.com",
      documents: [
        {
          type: "cpf",
          number: "52880458013",
        },
      ],
      phone_numbers: ["+5511888888888"],
      birthday: "1995-10-10",
    };
    const path = createPath({ entity: "customers" });
    const { data } = await pagarmeConnect.post(path, payload);

    return data;
  } catch (err) {
    console.log(err.response.data);
    throw 500;
  }
};
