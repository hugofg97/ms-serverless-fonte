const { statusCode, messageResponse } = require("../consts");

const successfullyCreated = async ({ data }) => {
  return {
    statusCode: statusCode.CREATED,
    body: JSON.stringify({
      data: data,
      message: messageResponse.CREATED,
    }),
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  },
  };
};
const successfullyRead = async ({ data }) => {
  return {
    statusCode: statusCode.OK,
    body: JSON.stringify({
      data: data,
      message: messageResponse.READ_DATA,
    }),
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  },
  };
};
const handleError = async ({ error }) => {
  let field;
  if (error?.field !== null && error?.field !== undefined) {
    field = error.field;
    error = error.error;
  }
  switch (error) {
    case statusCode.ALREAD_EXISTS:
      return alreadExists({ field: field });

    case statusCode.NOT_FOUND:
      return notFound();

    case statusCode.BAD_REQUEST:
      return badRequest();

    case statusCode.UNAUTHORIZED:
      return unauthorized();

    default:
      return internalServerError(error);
  }
};
const internalServerError = async (error) => {
  return {
    statusCode: statusCode.INTERNAL_SERVER_ERROR,
    body: JSON.stringify({ message: error }),
  };
};
const alreadExists = async ({ field }) => {
  return {
    statusCode: statusCode.ALREAD_EXISTS,
    body: JSON.stringify({ message: field + messageResponse.ALREAD_EXISTS }),
  };
};
const notFound = async () => {
  return {
    statusCode: statusCode.NOT_FOUND,
    body: JSON.stringify({ message: messageResponse.NOT_FOUND }),
  };
};
const badRequest = () => {
  return {
    statusCode: statusCode.BAD_REQUEST,
    body: JSON.stringify({ message: messageResponse.INVALID_DATA }),
  };
};
const unauthorized = () => {
  return {
    statusCode: statusCode.UNAUTHORIZED,
    body: JSON.stringify({ message: messageResponse.UNAUTHORIZED }),
  };
};
module.exports = {
  successfullyCreated,
  successfullyCreated,
  handleError,
  badRequest,
  unauthorized,
  notFound,
  alreadExists,
  successfullyRead,
};
