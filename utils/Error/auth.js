const { check } = require("express-validator");
const user = require("../../model/user");
const ApiError = require("../ErroreApi");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const { throws } = require("assert");
const { stringify } = require("querystring");
exports.SignUp = [
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
  check("place").notEmpty().withMessage("must not Empty"),

  check("governorate")
    .notEmpty()
    .withMessage("it is require")

    
    
];
exports.Login = [
  check("email")
    // .notEmpty()
    // .withMessage("it is empty")
    .optional()
    .isEmail()
    .withMessage("must me hae email"),
  check("password").notEmpty().withMessage("must not Empty"),
  check("PhoneNumber")
    .optional()
    // .withMessage("must not Empty")
    .isMobilePhone("ar-IQ")
    .withMessage("Just Iraqi Number")
    .custom(
      async (val) =>
        await User.findOne({ PhoneNumber: val }).then((v) => {
          if (!v) {
            return;
          } else {
            throw new Error("This phone number already exist");
          }
        })
    ),


  ,
];

