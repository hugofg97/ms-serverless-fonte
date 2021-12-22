const { createPath, pagarmeConnect } = require("../config/pagarmeConection");

module.exports = class CustomerPG {
  constructor() {
    this.entity = 'customers'
  }
  async createCustomer({ name, lastName, email, mobilePhone, document, _id, birthDate }) {
    try {
      const payload = {
        name: `${name} ${lastName}`,
        email,
        code: _id,
        document,
        type: "individual",
        document_type: "CPF",
        birthDate,
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: mobilePhone.substr(0, 2),
            number: mobilePhone.substr(2)
          }
        }
      }
      const path = createPath({ entity: this.entity });
      const { data } = await pagarmeConnect.post(path, payload);
      return data;
    } catch (err) {
      throw 500;
    }
  };
  async createAddress({ idPg, street, zipCode, neighborhood, number, complement, city, state, country }) {
    try {
      const payload = {
        line_1: `${number ?? 'Sem número'}, ${street}, ${neighborhood}`,
        line_2: `${complement ?? 'Sem complemento'}`,
        zip_code: zipCode,
        city,
        state,
        country,

      }
      const path = createPath({ entity: this.entity, param: `${idPg}/addresses` });
      const { data } = await pagarmeConnect.post(path, payload);
      return data;
    } catch (err) {
      throw 500;
    }
  }
  async getCustomers() {
    try {
      const path = createPath({ entity: this.entity });
      const { data } = await pagarmeConnect.get(path);

      return data;
    } catch (err) {
      // console.log(err.response.data)
      throw 500;
    }
  };
  async getCustomerById({ id }) {
    try {
      const path = createPath({ entity: this.entity, param: id });
      const { data } = await pagarmeConnect.get(path);

      return data;
    } catch (err) {
      // console.log(err.response.data)
      throw 500;
    }
  };
  async updateCustomer({ id, customer }) {
    try {
      const path = createPath({ entity: this.entity, param: id });
      const { data } = await pagarmeConnect.put(path, customer);

      return data;
    } catch (err) {
      // console.log(err.response.data)
      throw 500;
    }
  };

} 
