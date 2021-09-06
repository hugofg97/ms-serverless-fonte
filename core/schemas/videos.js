"user strict";

const mongoose = require("mongoose");
require("./db");

const schema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoName: {
      type: String,
      required: true,
    },
    videoDescription: {
      type: String,
      required: true,
    },
    locked: {
      type: Boolean,
      required: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const connectDb = mongoose.model("videosModel", schema);

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
