const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Interested", "Ignored", "Accepted", "Rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const connectionModel = mongoose.model("Connection", connectionSchema);

module.exports = connectionModel;
