const { signedCookies } = require("cookie-parser");
const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  let token = req.signedCookies.token;

 
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      console.log("token received");
    }
  }

  if (!token) {
    console.log("token not received");
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, phone_number, userId, role, location, profile_completed } =
      isTokenValid({
        token,
      });
    req.user = {
      name,
      phone_number,
      userId,
      role,
      location,
      profile_completed,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    // console.log(roles);
    // console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
