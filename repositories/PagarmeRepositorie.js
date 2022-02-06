const { createPath, pagarmeConnect } = require("../core/config/pagarmeConection");

module.exports = class PagarmeRepository {
  constructor() {
    this.entity = 'customers'
  }
  async createCustomer({ customer }) {
    try {
      const path = createPath({ entity: this.entity });
      const  {data}  = await pagarmeConnect.post(path, customer);
      console.log(data)
      return data;
    } catch (err) {
      console.log(err)
      throw 500;
    }
  };

  async createBillingCard({card}) {
    try {
  
      const path = createPath({ entity: this.entity, param: `${idPg}/cards` });
      const { data } = await pagarmeConnect.post(path, card);
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>', data)
    
      return data;
    } catch (err) {
    console.log(err)
      throw 500;
    }
  }
  async deleteBillingCard({ idPg, idCard}) {
    try {
      const path = createPath({ entity: this.entity, param: `${idPg}/cards/${idCard}` });
      const { data } = await pagarmeConnect.delete(path);
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>', data)
    
      return data;
    } catch (err) {
    console.log(err)
      throw 500;
    }
  }
  async findCustomers() {
    try {
      const path = createPath({ entity: this.entity });
      const { data } = await pagarmeConnect.get(path);

      return data;
    } catch (err) {
      // console.log(err.response.data)
      throw 500;
    }
  };
  async findCustomerById({ id }) {
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
  async payRecurrency({ card }) {
    try {
      const path = createPath({ entity: 'subscriptions' });
      const { data } = await pagarmeConnect.post(path, card);
      return data;
    } catch (err) {
      throw err;
    }
  }
  async findSignature({ subscriptionId }) {
    try {
 
      const path = createPath({ entity: 'subscriptions', param: subscriptionId });
      const { data } = await pagarmeConnect.get(path);
 
      const signature = data.data[0]?? null;
      if(signature?.id) {
        delete signature.customer;
        delete signature.current_cycle;
        signature.card_four_digits =signature.card.card_four_digits;
        delete signature.card;
        delete signature.plan;
        delete signature.items;
      }
      return signature;
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
  async findInvoiceByCustomerId({ idPg }) {
    try {
      
      const query = `/invoices?customer_id=${idPg}`

      const { data } = await pagarmeConnect.get(query);

      const invoices = data?.data[0] ?? null;

      if(invoices?.id) {
        delete invoices.items;
        delete invoices.customer;
        delete invoices.charge;

      }
      return invoices;
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
  async findChargesByCustomerId({  idPg }) {
    try {
     
      const query = `/charges/?customer_id=${idPg}`
      const { data } = await pagarmeConnect.get(query);
      const charges = data?.data[0] ?? null;
      if(charges?.id) {
        delete charges.card;
        delete charges.plan;
        delete charges.items;
        delete charges.customer;
        delete charges.invoice;
        delete charges.last_transaction;
      }
 
      return charges;
    } catch (err) {
      console.log(err)
      throw err;
    }
  }


} 
