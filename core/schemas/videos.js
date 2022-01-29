"user strict";

const dynamoose = require("dynamoose");
require("./db");
const uuid = require('uuid');
const schema = new dynamoose.Schema(
  {
    _id: {
      type:String,
      default: uuid.v4(),
      hashKey: true,
      
    },
    orderByLike: {
      type: String,
      default: 'order-desc',
      index: {
        name:'order-like-index',
        global:true,
        rangeKey: 'likes'

      }
    },
    'sessionId': {
      type: String,
      required: true,
      index: {
        name:"session-id-index",
        global:true,
        rangeKey: 'createdAt'
      }
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoName: {
      type: String,
      required: true,
      index: {
        name: 'video-name-index',
        global: true,
        rangeKey: 'createdAt'
      }
    },
    videoDescription: {
      type: String,
      required: true,
    },
    videoThumb: {
      type: String,
      required: true,
    },
    locked: {
      type: Boolean,
      required: true,
    },
    thoseWhoLiked: {
      type: Array,
    },
    likes: {
      type: Number,
      default: 0,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true,saveUnknown:true }
);

const connectDb = dynamoose.model("videosModel", schema);

const modelKeys = [
  "sessionId",
  "videoUrl",
  "videoName",
  "videoDescription",
  "locked",
];
module.exports = {
  modelKeys,
  connectDb,
};
