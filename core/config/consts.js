// status response
module.exports.statusCode = Object.freeze({
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  ALREAD_EXISTS: 409,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
});

// message response
module.exports.messageResponse = Object.freeze({
  CREATED: "Registro criado com sucesso",
  UPDATED: "Registro atualizado com sucesso",
  DELETED: "Registro deletado com sucesso",
  READ_DATA: "Dados listados com sucesso",
  NOT_FOUND: "Registro não encontrado",
  ALREAD_EXISTS: "Registro ja existe",
  INVALID_DATA: "Dados inválidos",
  UNAUTHORIZED: "Não autorizado",
});

// register methods
module.exports.methods = Object.freeze({
  POST: "POST",
  PUT: "PUT",
  GET: "GET",
  DELETE: "DELETE",
});

// controllers

module.exports.controllersEntitys = Object.freeze({
  VIDEO: "VIDEO",
  SESSION: "SESSION",
  SUBSCRIBER: "SUBSCRIBER",
});
