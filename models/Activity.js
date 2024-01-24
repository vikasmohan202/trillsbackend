const mongoose = require("mongoose");
const Activity = mongoose.Schema(
  {
    heading: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "CREATION",
        "UPDATION",
        "DELETION",
        "REMINDER",
        "WARNING",
        "REQUEST",
      ],
    },
    description: { type: String, required: true },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    request_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Request",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Activity", Activity);
