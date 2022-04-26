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
  
      console.log(card)
      const path = createPath({ entity: this.entity, param: `${card?.idPg}/cards` });
      const { data } = await pagarmeConnect.post(path, card);
    console.log(data)
      return data;
    } catch (err) {
    console.log(err)
      throw 500;
    }
  }
  async updateBillingCard({card}) {
    try {
      const path = createPath({ entity: 'customers', param: `${card?.idPg}/cards/${card?.cardId}` });
      delete card.cardId;
      delete card.idPg;
      const { data } = await pagarmeConnect.put(path, card);
    
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
  async findCustomerById({ idPg }) {
    try {
      const path = createPath({ entity: this.entity, param: idPg });
      const { data } = await pagarmeConnect.get(path);
      // console.log(data)
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
  async cancelSignature({ subscription_id }) {
    try {
      const path = createPath({ entity: 'subscriptions', param: subscription_id });
      const { data } = await pagarmeConnect.delete(path, {
        "cancel_pending_invoices": true
   });
      return data;
    } catch (err) {
      throw err;
    }
  }
  async payCharge({ charge_id }) {
    try {
      const path = createPath({ entity: 'charges', param: `${charge_id}/retry` });
      const { data } = await pagarmeConnect.post(path);
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
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<', signature)
        delete signature.customer;
        delete signature.current_cycle;
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
  async updateBillingCardSignature({ signature, cardId }) {
    try {
      const query = `subscriptions/${signature}/card`

      const { data } = await pagarmeConnect.patch(query, {'card_id': cardId});
      console.log(data)
      return data;
    } catch (err) {
      
      throw err;
    }
  }
  async updateBillingCardCharge(card) {
    try {
      const query = `charges/${card?.chargeId}/payment-method`
      delete card.chargeId;
      delete card.options
      // console.log('__________________',card)
      const { data } = await pagarmeConnect.patch(query, { 'update_subscription': true,'payment_method':'credit_card','credit_card': card,'operation_type':'auth_only','installments':1,'statement_descriptor':'Fonte assinatura'});

      return data;
    } catch (err) {
      
      throw err;
    }
  }
  async findChargesByCustomerId({  idPg }) {
    try {
     
      const query = `/charges/?customer_id=${idPg}`
      const { data } = await pagarmeConnect.get(query);
      const charges = data?.data[0] ?? null;
      if(charges?.id) {
        delete charges.plan;
        delete charges.items;
        delete charges.customer;
        delete charges.invoice;
        delete charges.last_transaction;
      }
 
      return charges;
    } catch (err) {
      
      throw err;
    }
  }
  async updateDateBillingSubscription({  signature, date }) {
    try {
     
      const query = `/subscriptions/${signature}/billing-date`
      const { data } = await pagarmeConnect.patch(query, {"next_billing_at": date});
      return data;
      
    } catch (err) {
      
      throw err;
    }
  }
  async getCardsByCustomer({ idPg }) {
    try {
     
      const query = `customers/${idPg}/cards`
      const { data } = await pagarmeConnect.get(query);
      console.log(data);
      return data.data.map(el => ({
        id: el.id,
        brand: el.brand,
        lastFourDigits: el.last_four_digits
      }));
      
    } catch (err) {
      
      throw err;
    }
  }


} 
