const express = require("express");
const app = express();
const router = express.Router();
const {
  register,
  generateOTP,
  validateOTP,
  updateCurrentUser,
  updateUser,
  getCurrentUser
} = require("../controllers/auth");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");



router.route("/register") .post(  register );


  router.route("/generateOTP/:phone_number").get(generateOTP );
 
  router.route("/validateOTP").post(
    validateOTP
  );

  router.route("/CurrentUser").get(authenticateUser, getCurrentUser);

  router.route("/CurrentUser").patch(authenticateUser,updateCurrentUser);

   router
     .route("/User/:id")
     .patch(
       authenticateUser,
       authorizePermissions(
         "admin",
       ),
       updateUser
     );

 



module.exports = router;
