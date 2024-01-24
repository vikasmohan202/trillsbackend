const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    about: {
      type: String,
    },
    gender: {
      type: String,
    },
    DOB:{
      type:Date,
    },
    profession: {
      type: String,
    },
    interests: [
      {
        type: String,
      },
    ],
    connections: [
      {
        user_id: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        added: {
          type: Date,
        },
      },
    ],
    password: {
      type: String,
      minlength: 6,
    },
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    phone_number: {
      type: String,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    profile_picture: {
      type: String,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    verificationToken: String,
    otp: {
      type: String,
      default: null,
    },
    otp_expiry: {
      type: Date,
    },
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    profile_completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  
  if(this.otp==null) return;
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.otp);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
