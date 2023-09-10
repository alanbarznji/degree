const express = require("express");
const { cr_user, ur_user, dr_user, gr_user } = require("../utils/Error/user");
const router = express.Router();
const Validation = require("./../validation/validation");
const { LoginAuth, AuthSignUp, protect, ForgetPassword, ResetCode, ChangePassword, sendSMS, ActivationSend, ActivationCode } = require("../service/auth");
const SendEmail = require("../utils/sendEmail");
// const { protect, toAllow } = require("../service/auth");w

router.post("/Login", LoginAuth).post("/SignUp", AuthSignUp);
  router.route("/forgetpassword").post(ForgetPassword);
  router.route("/resetcode").post(ResetCode);
  router.route("/changepassword").post(ChangePassword);
  router.route("/sendactive").post(ActivationSend);
  router.route("/activation").post(ActivationCode);
  // router.route("/sms").post(sendSMS)

module.exports = router;
