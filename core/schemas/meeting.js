const dynamoose = require("dynamoose");
require("./db");
const uuid = require('uuid');

const schema = new dynamoose.Schema(
  {
    _id: {
      type: String,
      hashKey:true,
      default: uuid.v4(),
      
    },
    type: {
      type: String,
      required: true,
      index: {
        name: 'type-index',
        gloval:true
      }
    },
    subscriberId: {
      type: String,
      required: true,
      index: {
        name: 'subscriber-id-index',
        global: true
      }
    },
    date: {
      type: String,
      required: true,
      index: {
        name: 'date-index',
        global: true,
        rangeKey: 'createdAt'
      }
    },
    hour: {
      type: String,
      required: true,
      index: {
        name: 'hour-index',
        global: true,
        rangeKey: 'createdAt'
      }
    },
    period: {
      type: String,
      required: true,
      index: {
        name: 'period-index',
        global: true,
        rangeKey: 'createdAt'
      }
    },
    status: {
      type: String,
      required: true,
      index: {
        name: 'status-index',
        global: true,
        rangeKey: 'createdAt'
      }
    },
    deletedAt: {
      type: Date,
      default: null
    },
  },
  { timestamps: true, saveUnknown:true }
);

const connectDb = dynamoose.model("meetingModel", schema);

module.exports = {
  connectDb,
};
