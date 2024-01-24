const Comment = require("../models/Comment");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;

const addComment = async (req, res) => {
  req.body.user = req.user.userId;
  const comment = await Comment.create({ ...req.body, post_id: req.params.id });
  res.status(StatusCodes.CREATED).json({ comment });
};

const updateComment = async (req, res) => {
  let result = await Comment.findOne({ _id: req.params.id, is_active: true });
  if (string(result.user) !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "You are not allowed to do this action"
    );
  }
  result = await Comment.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json({ result });
};

const getCommnetsByPost = async (req, res) => {
  let result = await Comment.find({
    post_id: req.params.id,
    is_active: true,
  }).sort({ updatedAt: -1 });
  res.status(StatusCodes.CREATED).json({ result });
};

const likeComment = async (req, res) => {
  let result = await Comment.findOne({ _id: req.params.id });
  let count_likes = result.likes ? result.likes : 0;
  result = await Comment.findOneAndUpdate(
    { _id: result._id },
    { likes: count_likes + 1 },
    { new: true }
  );
  res.status(StatusCodes.CREATED).json({ result });
};

module.exports = {
  addComment,
  updateComment,
  getCommnetsByPost,
  likeComment,
};
