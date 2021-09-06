const mongoose = require("mongoose");
require("./db");

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    subscriberId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    hour: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const connectDb = mongoose.model("meetingModel", schema);

module.exports = {
  connectDb,
};
