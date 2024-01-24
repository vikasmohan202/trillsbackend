const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    parent_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
      default: null,
    },
    post_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
    comment: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
