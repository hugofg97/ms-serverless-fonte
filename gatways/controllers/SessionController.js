const useCases = require("../../application/use_cases/main");
const serviceLocator = require("../../core/config/serviceLocator");
const SessionService = require("../services/SessionService");
const { ISession } = require("../../interfaces/ISession");
const { isRequired } = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyCreated,
  successfullyRead,
} = require("../../core/config/libs/ResponseService");

class SessionController {
  constructor() {
    this.service = new SessionService();
  }
  async create({ body }) {
    try {
      if (!body) throw 400;

      const session = new ISession(JSON.parse(body));

      isRequired(session.name, 400);
      isRequired(session.description, 400);
      isRequired(session.tag, 400);

      await this.service.findByName(
        session,
        {
          FindByName: useCases.Session.FindByName,
        },
        serviceLocator
      );

      const result = await this.service.create(
        session,
        {
          Create: useCases.Session.Create,
        },
        serviceLocator
      );

      return successfullyCreated({ data: result });
    } catch (error) {
      console.log(error);
      return handleError({ error });
    }
  }
  async findAll({ pathParameters, queryStringParameters }) {
    try {
      if (!pathParameters) throw 400;
      const { tag } = pathParameters;
      const subscriberId = queryStringParameters?.subscriberId ?? "";
      const limit = queryStringParameters?.limit ?? 5;

      isRequired(tag, 400);

      const result = await this.service.findAll(
        {
          limit: limit,
          tag: tag,
          subscriberId: subscriberId,
        },
        {
          FindAllSessions: useCases.Session.FindAll,
          PaginationVideo: useCases.Video.Pagination,
        },
        serviceLocator
      );

      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async findAllTags() {
    try {
      const tags = this.service.findAllTags();
      return successfullyRead({ data: tags });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }

  async pagination({ pathParameters, queryStringParameters }) {
    try {
      const { tag, page } = pathParameters;

      await isRequired(page, 400);
      await isRequired(tag, 400);

      const subscriberId = queryStringParameters?.subscriberId ?? "";

      const result = await this.service.pagination(
        { page: page, tag: tag, subscriberId: subscriberId },
        {
          Pagination: useCases.Session.Pagination,
          PaginationVideo: useCases.Video.Pagination,
        },
        serviceLocator
      );

      return successfullyRead({ data: result });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async update() {}
}

module.exports = SessionController;
