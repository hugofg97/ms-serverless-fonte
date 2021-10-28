const TherapyController = require("../../controllers/TherapyController");

const therapyController = new TherapyController();

module.exports.create = async (event) => {
  const { body, pathParameters } = event;
  return await therapyController.create({ body, pathParameters });
};
module.exports.findAll = async (event) => {
  const { body, pathParameters, queryStringParameters } = event;
  return await therapyController.findAll({
    body,
    pathParameters,
    queryStringParameters,
  });
};
