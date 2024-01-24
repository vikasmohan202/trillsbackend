const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    kind:{
      type:String,
      enum:["CONNECTION", "MEETING"]
    },
    status:{
      type:String,
    enum:["PENDING","ACCEPTED","REJECTED"],
     default:"PENDING"
    },
    description:{
      type:String,
    },
    date:{
      type:Date,
    },
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

module.exports = mongoose.model("Request", RequestSchema);
