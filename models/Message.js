const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chat_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Chat",
    },
    sender_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    msg: {
      type: String,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
