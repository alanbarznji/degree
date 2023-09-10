const {
  c_degreeCollege,
  g_degreeCollege,
  u_degreeCollege,
  d_degreeCollege,
  gs_degreeCollege,
} = require("../service/KurdstanCollegeDegree");
const express = require("express");
const { cr_user, ur_user, dr_user, gr_user } = require("../utils/Error/user");
const router = express.Router();
const Validation = require("../validation/validation");
const { LoginAuth, AuthSignUp } = require("../service/auth");

const { protect, toAllow } = require("../service/auth");
const { gr_IraqCollegeDegree } = require("../utils/Error/IraqDegreeCollege");
router
  .route("/")
  .post(protect, toAllow("admin", "user"), c_degreeCollege)
  .get(protect, toAllow("admin", "user"),gr_IraqCollegeDegree,Validation, g_degreeCollege);
router
  .route("/:id")
  .put(protect, toAllow("admin"), u_degreeCollege)
  .delete(protect, toAllow("admin"), d_degreeCollege)
  .get(protect, toAllow("admin"), gs_degreeCollege);
// router.route("/getMe").get(protect, getLoggedUserData, gs_User);
// router.route("/UpdateMe").put(protect, UpdateLoggedUserData);
// router.route("/UpdateDataMe").put(protect, UpdateLoggedData);
// router.route("/deactivation").put(protect, Deactivation);
// router.route("/activation").put(protect, Activation);
// router.use(protect, toAllow("admin"));

// router
//   .route("/:id")
//   .get(gr_user, get_validation, gs_User)
//   .put(ur_user, get_validation, u_User)
//   .delete(dr_user, get_validation, d_User);
// router.put(
//   "/changePassword/:id",
//   changePasswords,
//   get_validation,
//   changePassword
// );
module.exports = router;
