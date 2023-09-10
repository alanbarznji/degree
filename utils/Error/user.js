const { check } = require("express-validator");
const user = require("../../model/user");
const ApiError = require("../ErroreApi");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const { throws } = require("assert");
const { stringify } = require("querystring");
exports.cr_user = [
  check("name")
    .notEmpty()
    .withMessage("Must be require")
    .isLength({ min: 3 })
    .withMessage("To Short")
    .isLength({ max: 32 })
    .withMessage("To Short"),
  check("email")
    .notEmpty()
    .withMessage("it is empty")
    .isEmail()
    .withMessage("must me hae email")

    .custom(
      async (val) =>
        await User.findOne({ email: val }).then((val) => {
          console.log(val);
          if (val) {
            return Promise.reject(new Error("this email have account"));
          }
        })
    ),
  check("passwordconfirm").notEmpty().withMessage("must not Empty"),
  check("password")
    .notEmpty()
    .withMessage("must not Empty")
    .isLength({ min: 6 })
    .withMessage("To Short")
    .custom((val, { req }) => {
      if (val !== req.body.passwordconfirm) {
        throw new Error("Password and Confirm Password Not Match");
      }
      return true;
    }),
  check("PhoneNumber")
    .notEmpty()
    .withMessage("must not Empty")
    .isMobilePhone("ar-IQ")
    .withMessage("Just Iraqi Number"),
];
exports.ur_user = [
  check("id").isMongoId().withMessage("Invalid ID"),
  check("name").custom(
    async (val, { req }) =>
      await User.findById(req.params.id).then((v) => {
        if (!v) {
          throw new Error("User Not Found");
        }
        console.log(val, "   ", req.body.name);
        if (val == v.name) {
          throw new Error("Name Already Exist");
        }
      })
  ),
  check("password").custom(async (val, { req }) => {
    await User.findById(req.params.id).then(async (v) => {
      if (!v) {
        throw new Error("User Not Found");
      }
      const pass = await bcrypt.compare(val, v.password);
      if (pass) {
        throw new Error("it is same old password");
      }
    });
  }),
  check("place")
  .notEmpty()
  .withMessage("must not Empty")
  
  ,
  
]; 
exports.dr_user = [check("id").isMongoId().withMessage("Invalid ID")];

exports.gr_user = [check("id").isMongoId().withMessage("Invalid ID")];