const { createPath, pagarmeConnect } = require("../config/pagarmeConection");

module.exports = class CustomerPG {
  constructor() {
    this.entity = 'subscriptions'
  }

  async payRecurrency({ idPg, cards }) {
    try {
      const payload = {
        "plan_id": "plan_m2Vz6eqhQFMBJNZ7",
        "payment_method": "credit_card",
        "customer_id": idPg,
        "card_id": cards?.id,
        "metadata": {
          "id": idPg
        }

      }

      const path = createPath({ entity: this.entity });
      const { data } = await pagarmeConnect.post(path, payload);

      return data;
    } catch (err) {
      console.log(err)
      throw 500;
    }
  }


} 
