const express = require("express");
const app = express();
const router = express.Router();
const {
  createChat,
  getChatById,
  getUserChats,
  getChatMessages,
  addMessage,
  sendRequest,
  updateRequest,
  getIncomingRequests,
  getSentRequests,
  getRequestById,
  getUserNotifications
} = require("../controllers/chat");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");


router.route("/chat").post(authenticateUser,authorizePermissions("admin", "user"),createChat);

router
  .route("/chat/:id")
  .get(authenticateUser, authorizePermissions("admin", "user"), getChatById);

router
  .route("/message/:id")
  .post(authenticateUser, authorizePermissions("admin", "user"), addMessage);

router
  .route("/user/chats")
  .get(authenticateUser, authorizePermissions("admin","user"), getUserChats);

router
  .route("/chat/messages/:id")
  .get(authenticateUser, authorizePermissions("admin", "user"), getChatMessages);



router
  .route("/request")
  .post(authenticateUser, authorizePermissions("user"), sendRequest);

 router
    .route("/request/incoming")
    .get(authenticateUser, authorizePermissions("user"), getIncomingRequests);

 router
   .route("/request/sent")
   .get(authenticateUser, authorizePermissions("user"), getSentRequests);

router
      .route("/request/:id")
      .patch(authenticateUser, authorizePermissions("user"), updateRequest);

router
  .route("/request/:id")
  .get(authenticateUser, authorizePermissions("user"), getRequestById);

router
    .route("/user/notifications")
    .get(authenticateUser, authorizePermissions("user"), getUserNotifications);

module.exports = router;
