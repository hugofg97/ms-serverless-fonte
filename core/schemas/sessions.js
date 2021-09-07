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

const connectDb = mongoose.model("sessionsModel", schema);

module.exports = {
  connectDb,
};
