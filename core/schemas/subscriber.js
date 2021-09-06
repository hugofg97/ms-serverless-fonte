const mongoose = require("mongoose");
require("./db");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const connectDb = mongoose.model("subscriberModel", schema);

module.exports = {
  connectDb,
};
