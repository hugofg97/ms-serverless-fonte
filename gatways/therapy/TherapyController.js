
const TherapyService = require("./TherapyService");

const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/libs/ResponseService");

class TherapyController {
  constructor() {
    this.service = new TherapyService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;
      const result = await this.service.create({therapy: JSON.parse(body)});

      return successfullyCreated({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findAll({ userSession }) {
    try {
      console.log("akiiiiiiiiiii",userSession)
      const result = await this.service.findAll(userSession);
      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
}

module.exports = TherapyController;
