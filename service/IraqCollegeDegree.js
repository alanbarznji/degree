const asyncHandler = require("express-async-handler");
const Degrees = require("../model/IraqCollegeDegree");
const Degree = require("../model/KurdistanCollegeDgrees");
const ErrorApi = require("../utils/ErroreApi");
const factory = require("./hundling");
const User = require("../model/user");
const ApiFeather = require("../utils/ApiFeatcher");
const ApiFeather2 = require("../utils/ApiFeatcher2");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
exports.c_degreeCollege = asyncHandler(async (req, res, next) => {
    const user = await User.findOne(req.user);
  const data = await Degrees.create({
    slug: req.body.slug,
    name: req.body.name,
    degree: req.body.degree.toFixed(2),
    collegeName: req.body.collegeName,
    sex: req.body.sex,
    governorate: req.body.governorate,
    TypeCollege: req.body.TypeCollege,
  });

  res.status(201).json({ 
data
 });
});
exports.g_degreeCollege  = asyncHandler(async (req, res, next) => {
  console.log(req.user._id);
  const user=await User.findById(req.user._id)
  const countDocuments=await Degrees.countDocuments()
  let api 
  let api2 
  let data2={}
  let filter={};
  if(req.body.filter){
    filter=req.body.filter
    console.log(user.place);
     if (user.place == "عراق") {
       if (user.governorate == "کركوك" && user.LanguageStudy == "كردي") {
         api = new ApiFeather(req.query, Degrees.find({ TypeCollege: filter }))
           .filter()
           .paging(countDocuments);
          //  api2 =new ApiFeather2(req.query,Degree.find({ TypeCollege: filter }))
          
          }
        else {
         api = new ApiFeather(req.query, Degrees.find({ TypeCollege: filter }))
           .filter()
           .paging(countDocuments);
       }
     } 
     else {
return next(new ErrorApi("your place cant get degree here", 400));
     }
  }
  else{
    if (user.place == "عراق") {
    if (user.governorate == "كركوك" && user.LanguageStudy == "كردي") {
      api = new ApiFeather(req.query, Degrees.find(filter))
      .filter()
      .paging(countDocuments);
      api2 = new ApiFeather2(req.query, Degree.find(filter))
       .filter()
      .paging(countDocuments);
      const { MongoDb2 } = api2;
      data2 = await MongoDb2;

    }    else {
      api = new ApiFeather(req.query, Degrees.find(filter))
      .filter()
      .paging(countDocuments);
    }
  }
    else{
      return   next(new ErrorApi("your place cant get degree here", 400));
    }
 
  }
  
  
  const { MongoDb, paginationResult } = api;
  
  // const { MongoDb2 } = api2;
  // data2 = await MongoDb2;
  const data=await MongoDb 

    res
      .status(201)
      .json({
        paginationResult,
        result: data.length,
        data: data,
        result2: data2.result, 
        data2: data2,
      });
  });
exports.gs_degreeCollege = factory.GetOne(Degrees);
exports.u_degreeCollege = factory.UpdateOne(Degrees);
exports.d_degreeCollege = factory.DeleteOne(Degrees);
