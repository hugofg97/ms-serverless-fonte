const mainRepositories = require("../repositories/main");

const defineRepository = () => {
  const utils = {
    ...mainRepositories,
  };

  return utils;
};

module.exports = defineRepository();
