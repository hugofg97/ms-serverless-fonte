const dynamoose = require("dynamoose");

const schema = new dynamoose.Schema(
  {
    "document": {
      "type": String,
      "hashKey": true,
    },
    "_id": {
      "type": String,
      index: {
        "name":"_id-index",
        global:true,
        rangeKey: 'createdAt'
      }
  },
  email: {
    type: String,
    required: true,
    index: {
      name: 'email-index',
      global: true,
      rangeKey: 'createdAt'
    }
  },
    idPg: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      required: true,
    },
 
    birthDate: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    mobilePhone: {
      type: String,
      required:true,
    },
    cards: {
      type: Array,
    },
    signature: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
    
  },
  { timestamps: true,saveUnknown:true }
);
const model = process.env.DYNAMO_TABLE_SUBSCRIBER;
const connectDb = dynamoose.model(model, schema);

module.exports = {
  connectDb,
  
};
