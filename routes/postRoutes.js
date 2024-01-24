const express = require("express");
const app = express();
const router = express.Router();
const {
  createPost,
  updatePost,
  getPostById,
  getPostsByCategory,
  getUserPosts,
  getAllPosts,
  likePost
} = require("../controllers/post");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.route("/post").post(authenticateUser,createPost);

router.route("/post/:id").get(authenticateUser, authorizePermissions("admin","user"),getPostById);

router
  .route("/post/:id")
  .patch(authenticateUser, authorizePermissions("admin", "user"), updatePost);

router
  .route("/post/like/:id")
  .get(authenticateUser, authorizePermissions("admin", "user"), likePost);

router.route("/post").get(authenticateUser, authorizePermissions("admin"),getPostsByCategory);

router
  .route("/user/posts")
  .get(authenticateUser, authorizePermissions("user"), getUserPosts);

router
  .route("/posts")
  .get(authenticateUser, authorizePermissions("user"), getAllPosts);




module.exports = router;
