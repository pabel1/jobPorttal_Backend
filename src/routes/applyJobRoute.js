// external import
const express = require("express");

// internal import
const {
  applyForJob,
  getAllApplicants,
  deleteApplicants,
  updateVisitStatus,
  getAllCategoryAndSubCategory,
  updateShortList,
  updateApply,

  getAllApplicantsByJobPostNameAndStatus,
  getAllFields,
  updateNewCV,
  getApplicantsBySearching,
  updatekeyValue,
} = require("../controllers/applyJobController");
const authVerification = require("../middleware/authVarification");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// creating router
const router = express.Router();

router.route("/applyjob").post(applyForJob);
router
  .route("/allapplications")
  .get(authVerification, authorizeRoles("Admin"), getAllApplicants);
router.route("/getfields/:jobpostname").get(getAllFields);

router
  .route("/deleteApplicants/:id")
  .delete(authVerification, authorizeRoles("Admin"), deleteApplicants);

router
  .route("/updateapply/:id")
  .put(authVerification, authorizeRoles("Admin"), updateApply);

router
  .route("/getallcategory")
  .get(authVerification, authorizeRoles("Admin"), getAllCategoryAndSubCategory);

router
  .route("/getallnewapplicant/:page")
  .get(
    authVerification,
    authorizeRoles("Admin"),
    getAllApplicantsByJobPostNameAndStatus
  );
router
  .route("/updateNewCv")
  .put(authVerification, authorizeRoles("Admin"), updateNewCV);
// update key value
router
  .route("/update/keyvalue/:id")
  .put(authVerification, authorizeRoles("Admin"), updatekeyValue);
router
  .route(`/getapplicants/search`)
  .get(authVerification, authorizeRoles("Admin"), getApplicantsBySearching);

module.exports = router;
