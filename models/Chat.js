const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {

    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    from: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
