const { createPath, pagarmeConnect } = require("../config/pagarmeConection");

module.exports.paymentAssignature = async (payload) => {
  try {

    const path = createPath({ entity: "subscriptions" });
    const data = await pagarmeConnect.post('/subscriptions', payload);
    console.log(data)
    return data;
  } catch (err) {
  console.log('______________>', err)
    throw 500;
  }
};