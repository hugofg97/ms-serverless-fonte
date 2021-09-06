const axios = require("axios");
const http = axios.create({
  baseURL: "https://api.pagar.me/1",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports.pagarmeConnect = http;

module.exports.createPath = ({ entity, param = null }) =>
  `/${entity}${param ? `/${param}` : ""}?api_key=${process.env.PG_KEY}`;
