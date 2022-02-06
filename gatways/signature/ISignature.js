const { isRequired, validateDocument } = require("../../core/libs/validator");

class ISignatureCustomer {
    constructor({
        name,
        lastName, 
        email,
        mobilePhone,
        document,
        _id,
        birthDate
    }){
        this.name = `${isRequired(name, 400)} ${isRequired(lastName, 400)}`,
        this.email = isRequired(email, 400),
        this.code = isRequired(_id, 400),
        this.document = validateDocument(document),
        this.type = "individual",
        this.document_type = "CPF",
        this.birthDate = isRequired(birthDate, 400),
        this.phones = {
          mobile_phone: {
            country_code: '55',
            area_code: isRequired(mobilePhone.substr(0, 2),400),
            number: isRequired(mobilePhone.substr(2), 400)
          }
        }
    }

    async create({signatureRepository}) {
        console.log(this)
        return await signatureRepository.createCustomer({customer: this});
    }
}

class ISignatureFindCustomerByEmail {
    constructor({email}){
        this.email = isRequired(email, 400);
    }

    async find({signatureRepository}) {
        return await signatureRepository.findCustomerByEmail({...this});
    }
}

class ISignatureFindCustomerByDocument {
    constructor({document}){
        this.document = isRequired(document, 400);
    }

    async find({signatureRepository}) {
        return await signatureRepository.findCustomerByDocument({...this});
    }
}

class ISignatureCustomerBillingCard {
    constructor({
        idPg,
        number,
        holderName,
        holderDocument,
        expMonth,
        expYear,
        cvv,
        brand,
        label,
        address 
    }){
        this.idPg = isRequired(idPg, 400);
        this.number = isRequired(number, 400);
        this.idCard = isRequire(holderName, 400);
        this.holder_document = validateDocument(holderDocument);
        this.exp_month = isRequired(parseInt(expMonth), 400);
        this.exp_year = isRequired(parseInt(expYear), 400);
        this.cvv = isRequired(cvv, 400);
        this.brand = isRequired(brand, 400);
        this.label = isRequired(label, 400);
        this.billing_address =  {...address, country: 'BR'},
        this.options = {
          "verify_card": true
      }
    }

    async create({signatureRepository}) {
        return await signatureRepository.createBillingCard({card:this});
    }
}

class ISignatureDeleteBillingCardCustomer {
    constructor({
        idPg,
        idCard
    }){
        this.idPg = isRequired(idPg, 400);
        this.idCard = isRequired(idCard, 400);
       
    }

    async delete({signatureRepository}) {
        return await signatureRepository.deleteBillingCard({...this});
    }
}

class ISignatureGetCustomers {
    async find({signatureRepository}) {
        return await signatureRepository.findCustomers();
    }
}

class ISignatureGetCustomerById {
    constructor({
        id
    }) {
        this.id = isRequired(id, 400);
    }
    async find({signatureRepository}) {
        return await signatureRepository.findCustomerById({...this});
    }
}

class ISignaturePayRecurrency {
    constructor({
        idPg,
        cardId,
        plan = "plan_m2Vz6eqhQFMBJNZ7",
        paymentMethod = 'credit_card'
    }) {
        this.idPg = isRequired(idPg, 400);
        this.cardId = isRequired(cardId, 400);
        this.plan = isRequired(plan, 400);
        this.paymentMethod = isRequired(paymentMethod, 400);
    }
    async create({signatureRepository}) {
        return await signatureRepository.payRecurrency({card: this});
    }
}

class ISignatureFindSignature {
    constructor({
       subscritionId
    }) {
        this.subscritionId = isRequired(subscritionId, 400);
  
    }
    async find({signatureRepository}) {
        return await signatureRepository.findSignature({...this});
    }
}

class ISignatureFindInvoiceByCustomerId{
    constructor({
       idPg
    }) {
        this.idPg = isRequired(idPg, 400);
  
    }
    async find({signatureRepository}) {
        return await signatureRepository.findInvoiceByCustomerId({...this});
    }
}

class ISignatureFindChargeByCustomerId{
    constructor({
       idPg
    }) {
        this.idPg = isRequired(idPg, 400);
  
    }
    async find({signatureRepository}) {
        return await signatureRepository.findChargesByCustomerId({...this});
    }
}

module.exports = {
    ISignatureFindCustomerByEmail,
    ISignatureFindCustomerByDocument,
    ISignatureFindChargeByCustomerId,
    ISignatureFindInvoiceByCustomerId,
    ISignatureFindSignature,
    ISignaturePayRecurrency,
    ISignatureCustomer,
    ISignatureCustomerBillingCard,
    ISignatureDeleteBillingCardCustomer,
    ISignatureGetCustomerById,
    ISignatureGetCustomers
}