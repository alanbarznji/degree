const {
  c_user, g_user, u_user, d_user, gs_user,
} = require("../service/user");
const express = require("express");
const { cr_user, ur_user, dr_user, gr_user } = require("../utils/Error/user");
const router = express.Router();
const Validation=require('./../validation/validation');
const { LoginAuth, AuthSignUp } = require("../service/auth");
// const { protect, toAllow } = require("../service/auth");w
router.
route('/').post(
  cr_user,
   Validation,
    c_user
  ).get(g_user);
  router.post('/Login',LoginAuth).post('/SignUp',AuthSignUp)
router
  .route("/:id")
  .put(ur_user, Validation, u_user)
  .delete(dr_user, Validation, d_user)
  .get(gr_user, Validation, gs_user);
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
