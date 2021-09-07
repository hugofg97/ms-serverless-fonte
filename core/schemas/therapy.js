const mongoose = require("mongoose");
require("./db");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
  { timestamps: true }
);

const connectDb = mongoose.model("therapyModel", schema);

module.exports = {
  connectDb,
};
