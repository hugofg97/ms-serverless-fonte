const axios = require("axios");
const http = axios.create({
  baseURL: "https://api.pagar.me/core/v5",
  headers: {
    "Content-Type": "application/json",
    "Authorization": 'Basic '+Buffer.from('sk_test_Z58AQoXcghQe91kb:').toString('base64')
  },
});

module.exports.pagarmeConnect = http;

module.exports.createPath = ({ entity, param = null }) =>
  `/${entity}${param ? `/${param}` : ""}`;
