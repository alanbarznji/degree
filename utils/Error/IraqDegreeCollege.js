const { check } = require("express-validator");
const user = require("../../model/user");
const ApiError = require("../ErroreApi");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const { throws } = require("assert");
const { stringify } = require("querystring");
const Degrees = require("../../model/IraqCollegeDegree");
const { default: slugify } = require("slugify");
exports.gr_IraqCollegeDegree=[
  check('user')
  .custom(async(val,{req})=>
  await User.findById(req.user._id).then((user)=>{
    if(!user.activation){
      throw new Error('please activate your account');
    }
  })
  )
]
exports.cr_IraqCollegeDegree = [
  check("name")
    .notEmpty()
    .withMessage("Must be require")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("degree")
    .notEmpty()
    .withMessage("Must be require")
    // .isLength({ max: 3 })
    // .withMessage("3 are maximum")
    ,
  check("collegeName")
    .notEmpty()
    .withMessage("Must be require")
    .custom(async (val, { req }) => 
      await Degrees.findOne({collegeName:val,name:req.body.name}).then((v) => {
        console.log(v,"hahaha");
        if (v) 
        {throw new Error("these college are find");}
      })
    ),
    
];
