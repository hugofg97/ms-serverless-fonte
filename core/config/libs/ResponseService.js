const { statusCode, messageResponse } = require("../consts");

const successfullyCreated = async ({ data }) => {
  return {
    statusCode: statusCode.CREATED,
    body: JSON.stringify({
      data: data,
      message: messageResponse.CREATED,
    }),
  };
};
const successfullyRead = async ({ data }) => {
  return {
    statusCode: statusCode.OK,
    body: JSON.stringify({
      data: data,
      message: messageResponse.READ_DATA,
    }),
  };
};
const handleError = async ({ error }) => {
  if (
    typeof status == "number" &&
    Object.entries(statusCode).filter(([_, value]) => status == value)
  )
    return internalServerError(error);

  switch (error) {
    case statusCode.ALREAD_EXISTS:
      return alreadExists();

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
const alreadExists = async () => {
  return {
    statusCode: statusCode.ALREAD_EXISTS,
    body: JSON.stringify({ message: messageResponse.ALREAD_EXISTS }),
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
