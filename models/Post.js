const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    kind:{
      type: String,
      enum:["POST","STORY"],
      default:"POST"
    },
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    photos: [
      {
        type: String,
      },
    ],
    videos: [{ type: String }],
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    likes:{
      type:Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

  },
  { timestamps: true }
);



module.exports = mongoose.model("Post", PostSchema);
