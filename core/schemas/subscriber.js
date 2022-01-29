const dynamoose = require("dynamoose");
const uuid = require('uuid')
require("./db");

const schema = new dynamoose.Schema(
  {
    "document": {
      "type": String,
      "hashKey": true,
      
    },
    "_id": {
      "type": String,
      "default": uuid.v4(),
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
    address: {
      type: Object,
      default: {}
    },
    cards: {
      type: Object,
      default: {}
    },
    signature: {
      type: Object,
      default: {}
    },
    deletedAt: {
      type: Date,
    },
    
  },
  { timestamps: true,saveUnknown:true }
);

const connectDb = dynamoose.model("subscribersModel", schema);

module.exports = {
  connectDb,
  
};
