const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const Errorhandeler = require("../utility/ErrorHandler");

const authVerification = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  try {
    if (!token) {
      return next(
        new Errorhandeler("Please login to access the resource", 401)
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { email, userId } = decoded;
    req.email = email;
    const rootUser = await UserModel.findOne({ email: email });
    req.user = rootUser;
    req.userId = userId;
    next();
  } catch (error) {
    next("Authentication Failed!");
  }
};

module.exports = authVerification;
