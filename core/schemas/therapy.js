const dynamoose = require("dynamoose");
require("./db");
const uuid = require('uuid');

const schema = new dynamoose.Schema(
  {
    _id: {
      type:String,
      hashKey:true,
      default: uuid.v4(),
      
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

const connectDb = dynamoose.model("therapyModel", schema);

module.exports = {
  connectDb,
};
