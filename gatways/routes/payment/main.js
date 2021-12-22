const Payment = require("../../controllers/PaymentController");

module.exports.payment = async (event, context) => {
  const { body, pathParameters } = event;
  return await Payment({ body, pathParameters });
};
