const { randomUUID } = require("crypto");
const dynamoose = require("dynamoose");

const schema = new dynamoose.Schema(
  {
    "_id": {
      "type": String,
      "hashKey": true,
      default: randomUUID(), 
  },
    "document": {
      "type": String,
      index: {
        "name":"document-index",
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
