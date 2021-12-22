const mongoose = require("mongoose");
require("./db");

const schema = new mongoose.Schema(
  {
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
    mobilePhone: {
      type: String,
      required:true,
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
