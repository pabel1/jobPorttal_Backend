// external import
const express = require("express");

// internal import
const {
  createJob,
  getAllJobPosts,
  updateJobPost,
  deleteJobPost,
  getAllJobPost,
} = require("../controllers/jobpostController");
const authVerification = require("../middleware/authVarification");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// creating router
const router = express.Router();

router
  .route("/createjob")
  .post(authVerification, authorizeRoles("Admin"), createJob);
router.route("/getalljobs").get(getAllJobPosts);

router
  .route("/getalljob")
  .get(authVerification, authorizeRoles("Admin"), getAllJobPost);
router
  .route("/updateJobPost/:id")
  .put(authVerification, authorizeRoles("Admin"), updateJobPost);
router
  .route("/deleteJobPost/:id")
  .delete(authVerification, authorizeRoles("Admin"), deleteJobPost);

module.exports = router;
