const { ISubscriberService } = require("../../interfaces/ISubscriber");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class extends ISubscriberService {
  async findByDocument({ document }, { FindOneSubscriber }, serviceLocator) {
    const subscriber = FindOneSubscriber({ document }, serviceLocator);
    return subscriber;
  }
  async findByEmail({ email }, { FindOneSubscriber }, serviceLocator) {
    const subscriber = FindOneSubscriber({ email }, serviceLocator);
    return subscriber;
  }
  async updatePassword(
    { document, password },
    { UpdatePassword },
    serviceLocator
  ) {
    const subscriber = UpdatePassword(
      { document: document, password: password },
      serviceLocator
    );
    return subscriber;
  }

  async encryptPassword({ password }) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  async comparePassword({ payloadPassword, password }) {
    return bcrypt.compareSync(payloadPassword, password);
  }

  async generateToken({ _id, name, lastName, email, document, birthDate }) {
    return jwt.sign(
      { _id, name, lastName, email, document, birthDate },
      process.env.SECRET
    );
  }

  async createSubscriber(subscriber, { CreateSubscriber }, serviceLocator) {
    const newSubscriber = await CreateSubscriber(subscriber, serviceLocator);
    return newSubscriber;
  }

  async sendMail({ email }) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER_NAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const info = await transporter.sendMail({
      from: `FONTE APP <${process.env.MAIL_USER_NAME}`,
      to: email,
      subject: "Recuperação de senha",
      text: "Clique no link e recupere sua senha",
      html: "<b>Copie e cole o código no seu app: BHV45</b>",
    });

    info.codeSecurity = "BHV45";

    return info;
  }
};