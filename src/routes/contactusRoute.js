// external import
const express = require("express");
const {
  createContact,
  getAllContacts,
} = require("../controllers/contactController");
const authVerification = require("../middleware/authVarification");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// internal import

// creating router
const router = express.Router();

router.route("/createContact").post(createContact);
router
  .route("/getallContacts")
  .get(authVerification, authorizeRoles("Admin"), getAllContacts);

module.exports = router;
