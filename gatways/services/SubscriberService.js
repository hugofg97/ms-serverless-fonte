const { ISubscriberService } = require("../../interfaces/ISubscriber");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class extends ISubscriberService {
  async findById({subscriberId}, {FindById}, serviceLocator) {
    const subscriber = await FindById({ subscriberId }, serviceLocator);
    return subscriber;
  }
  async findByDocument({ document }, { FindOneSubscriber }, serviceLocator) {
    const subscriber = await FindOneSubscriber({ document }, serviceLocator);
    return subscriber;
  }
  async findByEmail({ email }, { FindOneSubscriber }, serviceLocator) {
    const subscriber = await FindOneSubscriber({ email }, serviceLocator);
    return subscriber;
  }
  async updatePassword(
    { document, password },
    { UpdatePassword },
    serviceLocator
  ) {
    const subscriber = await  UpdatePassword(
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
  async updateSubscriber(subscriber, { UpdateSubscriber }, serviceLocator) {
    const updatedSubscriber = await UpdateSubscriber(
      subscriber,
      serviceLocator
    );
    return updatedSubscriber;
  }
  async setUrlImageProfile({document, profileImage}, { SetProfileImage }, serviceLocator) {
    const updatedSubscriber = await SetProfileImage(
      {document, profileImage},
      serviceLocator
    );
    return updatedSubscriber;
  }
  async countSubscribers({ CountSubscribers }, serviceLocator) {
    const count = await CountSubscribers(serviceLocator);
    return count;
  }

  async sendMail({ email }) {
    const transporter = nodemailer.createTransport({
      host: 'email-smtp.sa-east-1.amazonaws.com',
      port: 587,
      secure: false,
      auth: {
        user: 'AKIAZQQHQFY4EG4CAQ6V',
        pass: 'BMIigJ+UKb9vUyxQS8LLb9ojnmu2Gdh8CeICCyzfkVt6',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
   
    let code = Math.random().toString(36).substring(7);
    const info = await transporter.sendMail({
      from: `FONTE APP <suporte@fontereiki.com.br`,
      to: 'hugo.fersoft@gmail.com',
      subject: "Recupera????o de senha",
      text: "Clique no link e recupere sua senha",
      html: `<b>Copie e cole o c??digo no seu app: ${code}</b>`,
    });
    console.log(info)

    return code;
  }
};
