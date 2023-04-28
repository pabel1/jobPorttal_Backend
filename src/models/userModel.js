const mongoose = require("mongoose");
const validator = require("validator");
const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Employee Name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin"],
    },
    __v: false,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userModel);

module.exports = UserModel;
