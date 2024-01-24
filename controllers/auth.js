const User = require("../models/User");
// const Activity = require("../models/Activity");
// const Plan = require("../models/Plan");
const fs = require("fs");
const path = require("path");
const twilio_client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  createJWT,
} = require("../utils");


const register = async (req, res) => {
  let digits = "1234567890";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  req.body.otp = otp;

  const AlreadyExists = await User.findOne({
    phone_number: req.body.phone_number,
    is_active: true,
  });

  if (AlreadyExists) {
    throw new CustomError.UnauthorizedError(
      "User already exists for given mobile number"
    );
  }



  const isFirstAccount = (await User.countDocuments({})) === 0;

  if (isFirstAccount) {
    req.body.role = "admin";
  }
  await User.create(req.body);

  res.status(StatusCodes.CREATED).json({
    msg: "Success! ",
  });
};

const generateOTP = async (req, res) => {
  let digits = "1234567890";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  let date = new Date();
  date.setMinutes(date.getMinutes() + 1);
  let user=null;
      user = await User.findOneAndUpdate(
    { phone_number: req.params.phone_number, is_active: true },
    { otp: otp, otp_expiry: date },
    { new: true }
  );

  console.log(user);

  if (!user) {
    console.log("test")
     user = await User.create({
       phone_number: req.params.phone_number,
       otp: otp,
       otp_expiry: date,
     });
  }
  
  twilio_client.messages
    .create({
      body: `your otp for login is ${otp}. It will expire in one minute`,
      from: "+19287935351",
      to: req.params.phone_number,
    })
    .then((message) => console.log(message.sid));
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "Success! ",
  });
};

const validateOTP = async (req, res) => {
  const user = await User.findOne({
    phone_number: req.body.phone_number,
    is_active: true,
  });

  if (!user) {
    throw new CustomError.NotFoundError(
      "No account found for given phone number"
    );
  }
  // date = new Date();
  // if (user.otp == null || user.otp_expiry.getTime() <= date.getTime()) {
  //   throw new CustomError.BadRequestError("OTP expired");
  // }
  // const isPasswordCorrect = await user.comparePassword(req.body.otp);
  // if (!isPasswordCorrect) {
  //   throw new CustomError.UnauthenticatedError("Incorrect OTP");
  // }
  // await User.findOneAndUpdate({ _id: user._id }, { otp: null }, { new: true });
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse({ res, user: tokenUser, token });
  res.status(StatusCodes.OK).json({ user: tokenUser, token });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    let token = authHeader.split(" ")[1];
    token = null;
  }
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne(
    { _id: req.user.userId },
    {
      name: 1,
      gender: 1,
      location: 1,
      phone_number: 1,
      role: 1,
      about: 1,
      profile_picture: 1,
      interests: 1,
      profile_completed:1,
      DOB: 1,
    }
  );
  res.status(StatusCodes.OK).json({ user });
};

const updateCurrentUser = async (req, res) => {
  if (req.files && req.files.profile_picture) {
    const result = await cloudinary.uploader.upload(
      req.files.profile_picture.tempFilePath,
      {
        use_filename: true,
        folder: "Documents",
      }
    );
    fs.unlinkSync(req.files.profile_picture.tempFilePath);
    req.body.profile_picture = result.secure_url;
  }
  if (
    req.body.otp ||
    req.body.is_active ||
    req.body.is_verified ||
    req.body.role
  ) {
    throw new CustomError.UnauthorizedError(
      "You are not allowed to do this action"
    );
  }
  req.body.profile_completed =true;
  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  if (req.body.password || req.body.is_verified) {
    throw new CustomError.UnauthorizedError(
      "You are not allowed to do this action"
    );
  }
  const result = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json({ result });
};

const getUsersByrole = async (req, res) => {
  let result = null;

  if (req.query.role) {
    result = await User.find({
      role: req.query.role,
      is_active: true,
    }).lean();
  }
  res.status(StatusCodes.OK).json({ result });
};

module.exports = {
  register,
  logout,
  generateOTP,
  validateOTP,
  updateCurrentUser,
  updateUser,
  getUsersByrole,
  getCurrentUser,
};
