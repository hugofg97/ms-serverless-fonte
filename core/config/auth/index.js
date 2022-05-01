const { verify, decode } = require("jsonwebtoken");

module.exports.AuthMiddleware = async (event) => {
  const { headers } = event;
  let tokenDecoded;
  if(headers.Authorization) {
    headers.authorization = headers.Authorization;
  }
  if (!headers.authorization) return false;
  const { authorization } = headers;
  const parts = authorization.split(" ");
  if (parts.length !== 2) return false;
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) return false;
  return verify(token, process.env.SECRET, async(error, payloadDecoded)=> {
      if(error) return false
      tokenDecoded = payloadDecoded;
      event.userSession = tokenDecoded;
      return event;
  });
};
module.exports.ExtractDataIfLoggedIn = async (event) => {
  const { headers } = event;
  let tokenDecoded;
  if (!headers.authorization) return event;
  const { authorization } = headers;
  const parts = authorization.split(" ");
  if (parts.length !== 2) return event;
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) return event;
  return verify(token, process.env.SECRET, async(error, payloadDecoded)=> {
      if(error) return event;
      tokenDecoded = payloadDecoded;
      event.userSession = tokenDecoded;
      return event;
  });
};