// internal import
const catchAsyncError = require("../middleware/catchAsyncError");
const UserModel = require("../models/userModel");
const Errorhandeler = require("../utility/ErrorHandler");
const jwtHandle = require("../utility/createToken");

// login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Errorhandeler("Please fill the value properly", 400));
  }
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    return next(new Errorhandeler("User not found", 404));
  }

  if (user.password !== password) {
    return next(new Errorhandeler("Invalid Credential", 401));
  }

  const token = await jwtHandle(user.email, user._id);
  res.status(200).json({
    success: true,
    user,
    access_token: token,
    message: "Login Successfully!!",
  });
});

// logout user
// exports.logoutUser = (req, res, next) => {
//   res.cookie("logintoken", null, {
//     expires: new Date(Date.now()),
//     httpOnly: true,
//   });
//   res.status(200).json({
//     success: true,
//     message: "Logged Out",
//   });
// };
