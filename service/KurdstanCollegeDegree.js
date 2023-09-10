const asyncHandler = require("express-async-handler");
const Degree = require("../model/KurdistanCollegeDgrees");
const ErrorApi = require("../utils/ErroreApi");
const factory = require("./hundling");
const User = require("../model/user");
const ApiFeather = require("../utils/ApiFeatcher");
// const ApiFeather2 = require("../utils/ApiFeatcher2");
const Degrees = require("../model/IraqCollegeDegree");
const ApiFeather2 = require("../utils/ApiFeatcher2");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
exports.c_degreeCollege = asyncHandler(async (req, res, next) => {
    const user = await User.findOne(req.user);
    const data = await Degree.create({
      name: req.body.name,
      degree: req.body.degree.toFixed(2),
      collegeName: req.body.collegeName,
      sex: req.body.sex,
      TypeCollege: req.body.TypeCollege,
    });
  res.status(201).json({ 
data
 });
});
exports.g_degreeCollege  = asyncHandler(async (req, res, next) => {
  const countDocuments=await Degree.countDocuments()
  console.log(req.user._id,"im id");
  const user = await User.findById(req.user._id);
  console.log('user',user,'user');
  let api;
  let api2;
  let data2
  let filter = {};
  if (req.body.filter!==null) {
    filter = req.body.filter;
    console.log(user.place, user.place == "كوردستان");
    if (user.place == "كوردستان") {
      if ((user.LanguageStudy == "عربي")) {
        api = new ApiFeather(req.query, Degree.find({ TypeCollege: filter }))
          .filter()
          .paging(countDocuments);
          api2 = new ApiFeather2(
            req.query,
            Degrees.find({ TypeCollege: filter })
          )
          console.log(api2);
            const { MongoDb2 } = api2;
            data2 = await MongoDb2;
      } 
      else {
        api = new ApiFeather(req.query, Degree.find({ TypeCollege: filter }))
          .filter()
          .paging(countDocuments);
      }
    }
  else{
      
      return next(new ErrorApi("your place cant get degree here",400))
    } }
    else {
         if (user.place == "كوردستان") {
      if (user.LanguageStudy == "عربي") {
        api = new ApiFeather(req.query, Degree.find(filter))
          .filter()
          .paging(countDocuments);
          api2 = new ApiFeather2(req.query, Degrees.find(filter));
            const { MongoDb2 } = api2;
            data2 = await MongoDb2;
      } else {

        return next(new ErrorApi("your place cant get degree here", 400));
      }
    } else {
        api = new ApiFeather(req.query, Degree.find(filter))
          .filter()
          .paging(countDocuments);
      }
    }
    const { MongoDb, paginationResult } = api;
const data=await MongoDb
    res.status(201).json({ paginationResult, result: data.length, data: data,data2:data2});
  });
exports.gs_degreeCollege = factory.GetOne(Degree);
exports.u_degreeCollege = factory.UpdateOne(Degree);
exports.d_degreeCollege = factory.DeleteOne(Degree);