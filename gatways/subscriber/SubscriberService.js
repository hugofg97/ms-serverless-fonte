const {
  ISubscriber,
  ISubscriberFindByDocument,
  ISubscriberFindByEmail,
  ISubscriberAuth,
  ISubscriberForgotPassword,
  ISubscriberUpdatePassword,
  ISubscriberFindById,
  ISubscriberProfileImage,
} = require("./ISubscriber");
const serviceLocator = require("../../core/config/serviceLocator");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ISignatureCustomer,
  ISignatureFindInvoiceByCustomerId,
  ISignatureFindChargeByCustomerId,
  ISignatureCustomerBillingCard,
  ISignatureDeleteBillingCardCustomer,
  ISignaturePayRecurrency,
  ISignatureGetCustomerById,
  ISignatureCancelSignature,
  ISignaturePayCharge,
  ISignatureEditBillingCard,
  ISignatureEditBillingCharge,
  ISignatureEditBillingSignature,
  ISignatureFindSignature,
  ISignatureUpdateBillingDate,
  ISignatureFindCards,
} = require("../signature/ISignature");
module.exports = class ISubscriberService {
  async findById({ subscriberId }, { FindById }) {
    const subscriber = await FindById({ subscriberId });
    return subscriber;
  }

  async findByDocument({ document }) {
    const subscriber = await new ISubscriberFindByDocument({ document }).find(
      serviceLocator
    );
    return subscriber;
  }

  async findByEmail({ email }) {
    const subscriber = await new ISubscriberFindByEmail({ email }).find(
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

  async createSubscriber({ subscriber }) {
    const newSubscriber = new ISubscriber(subscriber);
    if (await new ISubscriberFindByDocument(newSubscriber).find(serviceLocator))
      throw { error: 409, field: "CPF" }; // mudar pra uma classe
    if (await new ISubscriberFindByEmail(newSubscriber).find(serviceLocator))
      throw { error: 409, field: "Email" };
    newSubscriber.password = await this.encryptPassword(subscriber);
    let createdSubscriber = await newSubscriber.create(serviceLocator);
    let createSubscriberPagarme;
    if (createdSubscriber) {
      createSubscriberPagarme = await new ISignatureCustomer(
        createdSubscriber
      ).create(serviceLocator);
    }
    if (createSubscriberPagarme) {
      const { id } = createSubscriberPagarme;
      createdSubscriber = await new ISubscriber({
        ...createdSubscriber,
        idPg: id,
      }).update(serviceLocator);
    }
    delete createdSubscriber.password;
    const token = await this.generateToken(subscriber);

    return { ...subscriber, token };
  }

  async login({ user }) {
    const access = new ISubscriberAuth(user);
    const existsAcess = await new ISubscriberFindByEmail(access).find(
      serviceLocator
    );
    if (!existsAcess) throw 400;
    if (
      !(await this.comparePassword({
        payloadPassword: access.password,
        password: existsAcess?.password,
      }))
    )
      throw 400;
    const token = await this.generateToken(existsAcess);
    return { ...existsAcess, token };
  }

  async updateSubscriber({ subscriber }) {
    const updatedSubscriber = await new ISubscriber(subscriber).update(
      serviceLocator
    );
    return updatedSubscriber;
  }

  async createBillingCard({ card }) {
    const cardModel = new ISignatureCustomerBillingCard(card);
    const existsSubscriber = await new ISubscriberFindByDocument(card).find(
      serviceLocator
    );
    if (!existsSubscriber) throw 404;
    const existsSubscriberInPagarme = await new ISignatureGetCustomerById(
      card
    ).find(serviceLocator);
    if (!existsSubscriberInPagarme) throw 404;

    let newCard = await cardModel.create(serviceLocator);

    if (!newCard) throw 500;
    delete newCard.customer;
    if (!existsSubscriber.cards.includes(newCard?.id))
      existsSubscriber.cards.push(newCard?.id);
    const updatedSubscriber = await new ISubscriber(existsSubscriber).update(
      serviceLocator
    );
    return updatedSubscriber;
  }
  async updateBillingCard({ document, cardId }) {
    console.log('________', cardId, document);
    const existsSubscriber = await new ISubscriberFindByDocument({document}).find(
      serviceLocator
    );

    if (!existsSubscriber) throw 404;

    const existsSubscriberInPagarme = await new ISignatureGetCustomerById(
      existsSubscriber
    ).find(serviceLocator);

    if (!existsSubscriberInPagarme) throw 404;

    const signatureCardUpdated = await new ISignatureEditBillingSignature({
      signature: existsSubscriber?.signature,
      cardId: cardId,
    }).update(serviceLocator);


    return signatureCardUpdated;
  }
  async paymentAssignature({ document }) {
    const existsSubscriber = await new ISubscriberFindByDocument({
      document,
    }).find(serviceLocator);
    if (!existsSubscriber) throw 404;
    if (existsSubscriber.signature)
      throw { error: 409, field: "Usuário já possui assinatura ativa " };

    const existsCustomerInPagarme = await new ISignatureGetCustomerById(
      existsSubscriber
    ).find(serviceLocator);
    if (!existsCustomerInPagarme) throw 404;

    const payment = await new ISignaturePayRecurrency({
      idPg: existsSubscriber?.idPg,
      cardId: existsSubscriber?.cards.pop(),
    }).create(serviceLocator);
    if (!payment) throw 400;
    existsSubscriber.signature = payment?.id;
    const updatedSubscriber = await new ISubscriber(existsSubscriber).update(
      serviceLocator
    );
    return updatedSubscriber;
  }
  async cancelSignature({ document }) {
    const existsSubscriber = await new ISubscriberFindByDocument({
      document,
    }).find(serviceLocator);
    if (!existsSubscriber) throw 404;
    if (!existsSubscriber.signature)
      throw { error: 409, field: "Usuário não possui assinatura" };

    const existsCustomerInPagarme = await new ISignatureGetCustomerById(
      existsSubscriber
    ).find(serviceLocator);
    if (!existsCustomerInPagarme) throw 404;

    const cancel = await new ISignatureCancelSignature({
      signature: existsSubscriber?.signature,
    }).delete(serviceLocator);
    console.log(cancel);
    existsSubscriber.signature = "";
    const updatedSubscriber = await new ISubscriber(existsSubscriber).update(
      serviceLocator
    );
    return updatedSubscriber;
  }
  async payCharge({ chargeId }) {
    const pay = await new ISignaturePayCharge({ chargeId }).create(
      serviceLocator
    );
    if (!pay) throw 500;
    return pay;
  }

  async updateBillingDate({ document, date }) {
    const existsSubscriber = await new ISubscriberFindByDocument({
      document,
    }).find(serviceLocator);
    if (!existsSubscriber)
      return { error: 400, field: "Usuário não encontrado" };
    const updateDate = await new ISignatureUpdateBillingDate({
      signature: existsSubscriber?.signature,
      date,
    }).update(serviceLocator);
    if (!updateDate) throw 500;
    return updateDate;
  }
  async getCardsByCustomerDocument({ document }) {
    const existsSubscriber = await new ISubscriberFindByDocument({
      document,
    }).find(serviceLocator);
    if (!existsSubscriber)
      return { error: 400, field: "Usuário não encontrado" };
    const existsCustomerInPagarme = await new ISignatureGetCustomerById(
      existsSubscriber
    ).find(serviceLocator);
    if (!existsCustomerInPagarme) throw 404;
    console.log("))))))", existsSubscriber)
    const cards = await new ISignatureFindCards(existsSubscriber).find(serviceLocator);
    return cards;
  }

  async forgotPassword({ document }) {
    const identify = new ISubscriberForgotPassword({ document });
    const existSubscriber = await new ISubscriberFindByDocument(identify).find(
      serviceLocator
    );
    if (!existSubscriber) throw 400;
    const result = await this.sendMail(existSubscriber);
    return result;
  }

  async emailVerification({ email }) {
    const existSubscriber = await new ISubscriberFindByEmail({ email }).find(
      serviceLocator
    );
    if (existSubscriber) throw { error: 409, field: `Email: ${email} ` };
    const result = await this.sendMail({ email });
    return result;
  }

  async updatePassword({ document, password }) {
    const access = new ISubscriberUpdatePassword({ document, password });

    if (!(await new ISubscriberFindByDocument(access).find(serviceLocator)))
      throw 400;
    access.password = await this.encryptPassword(access);

    return await access.update(serviceLocator);
  }

  async setUrlImageProfile({ document, profileImage }) {
    return await new ISubscriberProfileImage({ document, profileImage }).update(
      serviceLocator
    );
  }

  async countSubscribers() {
    const count = await serviceLocator.subscriberRepository.count();
    return count;
  }

  async checkAccountExists({ user }) {
    let response = null;
    const documentExists = await new ISubscriberFindByDocument(user).find(
      serviceLocator
    );

    const emailExists = await new ISubscriberFindByEmail(user).find(
      serviceLocator
    );
    if (emailExists) response = "Email já cadastrado";
    if (documentExists) response = "CPF já cadastrado";
    if (emailExists && documentExists) response = "Email e CPF já cadastrados";
    return response;
  }

  async findSignature({ signature }) {
    const signatureExists = await new ISignatureFindSignature({
      subscritionId: signature,
    }).find(serviceLocator);

    if (!signatureExists) return {};
    return signatureExists;
  }

  async findInvoice({ idPg }) {
    const invoicesExists = await new ISignatureFindInvoiceByCustomerId({
      idPg,
    }).find(serviceLocator);

    if (!invoicesExists) return {};
    return invoicesExists;
  }

  async findCharge({ idPg }) {
    const chargeExists = await new ISignatureFindChargeByCustomerId({
      idPg,
    }).find(serviceLocator);

    if (!chargeExists) return {};
    return chargeExists;
  }

  async getAssignature({ subscriberId }) {
    const existsSubscriber = await new ISubscriberFindById({
      subscriberId,
    }).find(serviceLocator);

    if (!existsSubscriber) return {};

    const { idPg, signature } = existsSubscriber;

    if (!signature) return {};

    const invoicesExists = await new ISignatureFindInvoiceByCustomerId({
      idPg,
    }).find(serviceLocator);

    if (!invoicesExists) return {};

    const chargesBySubscriber = await new ISignatureFindChargeByCustomerId({
      idPg,
    }).find(serviceLocator);

    if (!chargesBySubscriber) return {};

    invoicesExists.charge = chargesBySubscriber;
    invoicesExists.active =
      invoicesExists?.status === "paid" &&
      invoicesExists?.charge?.status === "paid"
        ? true
        : false;
    return invoicesExists;
  }

  async signatureIsActive({ _id = "" }) {
    if (!_id) return false;
    const existsSubscriber = await new ISubscriberFindById({
      subscriberId: _id,
    }).find(serviceLocator);

    if (!existsSubscriber) return false;

    const chargesBySubscriber = await new ISignatureFindChargeByCustomerId(
      existsSubscriber
    ).find(serviceLocator);

    if (!chargesBySubscriber) return false;

    if (chargesBySubscriber?.status === "paid") return true;
    else return false;
  }

  async sendMail({ email }) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.email.sa-saopaulo-1.oci.oraclecloud.com',
      port: 25,
      secure: false,
      auth: {
        user: 'ocid1.user.oc1..aaaaaaaatm3alzvfglihspytxpjp2zol4evm7a7uzpaudj3z7qhkk6ecx2tq@ocid1.tenancy.oc1..aaaaaaaaxqi2ycs73ypn66clvje5lsui6scswznnecptbx5scta5d3lfl5nq.v1.com',
        pass: 'W_3EzxnIIB.t6wJ6B1TW',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let code = Math.random().toString(36).substring(12);
    const info = await transporter.sendMail({
      from: `FONTE APP <no-reply@accurate.com.br`,
      to: email,
      subject: "Recuperação de senha",
      text: "Clique no link e recupere sua senha",
      html: `<b>Copie e cole o código no seu app: ${code}</b>`,
    });
    console.log(info);

    return code;
  }
};
