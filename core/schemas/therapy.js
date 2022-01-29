const dynamoose = require("dynamoose");
require("./db");
const uuid = require('uuid');

const schema = new dynamoose.Schema(
  {
    _id: {
      type:String,
      hashKey:true,   
    },
    name: {
      type: String,
      required: true,
      index: {
        name: 'name-index',
        global:true,
        rangeKey: 'createdAt'

      }
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true, saveUnknown:true }
);
const model = process.env.DYNAMO_TABLE_THERAPY;

const connectDb = dynamoose.model(model, schema);

module.exports = {
  connectDb,
};
