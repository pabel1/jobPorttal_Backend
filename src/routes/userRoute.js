// external import
const express = require("express");
const { loginUser } = require("../controllers/userController");

// internal import

// creating router
const router = express.Router();

router.route("/login").post(loginUser);

module.exports = router;
