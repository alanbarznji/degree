const asyncHandler = require("express-async-handler");
const User = require("../model/user");
const ErrorApi = require("../utils/ErroreApi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const SendEmail = require("../utils/sendEmail");
const vonage = require("../utils/sendSMS");
const stringfy = require("stringfy");

exports.AuthSignUp=asyncHandler(async(req,res,next)=>{
  const a = [
    "بغداد",
    "البصرة",
    "النجف",
    "القادسية",
    "واسط",
    "بابل",
    "كربلاء",
    "المثنى",
    "ذي قار",
    "ميسان",
    "الديوانية",
    "صلاح الدين",
    "نينوى",
    "كركوك",
    "ديالى",
    "الأنبار",
  ];
  const b = ["دهوك", "أربيل", "السليمانية"];
  // console.log(!a.includes(req.body.governorate), "hahahaha");
  // if (!a.includes(req.body.governorate)) {
  //   return next(new ErrorApi(`هذا المحافظة غير متاح`, 401));
  // } 
  if (
    req.body.place == "عراق" 
  ) {
    if (!a.includes(req.body.governorate)) {
     return next(new ErrorApi("you must choose governorate of Iraq", 401));
 
  }
  } else {
    if (
      !b.includes(req.body.governorate) 
    ) {
      return next(new ErrorApi("you must choose governorate of Kurdistan", 401));
    }
  }
    const user = await User.create({
      name: req.body.name, 
      email: req.body.email,
      password: req.body.password,
      PhoneNumber: req.body.PhoneNumber,
      place: req.body.place,
      sex: req.body.sex,
      governorate: req.body.governorate,
      LanguageStudy: req.body.LanguageStudy, 
    });
    const token = jwt.sign({user:user._id}, process.env.JWT_USERTOKEN, {
      expiresIn: process.env.JWT_EXPIER,
    });
    res.status(201).send({data:user,token:token})

})
exports.LoginAuth=asyncHandler(async(req,res,next)=>{
  let user 
const a=req.body.userN.toString()

  if (a.startsWith('0'||'7')) {
    user = await User.findOne({ PhoneNumber: req.body.userN });
  } else {
    user = await User.findOne({ email: req.body.userN });
  }
if (!user) {
  return next(new ErrorApi(`Please enter a valid Email or Phone Number`,403));
}
    if(user){
       const password=await bcrypt.compare(req.body.password,user.password)
       console.log(password);
       if(!password){
           return next(new ErrorApi('Password Incorrect',403))
        }
  const token = jwt.sign({ user: user._id }, process.env.JWT_USERTOKEN, {
    expiresIn: process.env.JWT_EXPIER,
  });
  console.log(user);
        res.status(200).json({ data: user, token: token }); 
    }
    else{
        return next(new ErrorApi(`User Not Found`, 500)) 
    }
  
})
exports.protect=asyncHandler(async(req,res,next)=>{
  let token;
  //Verifica se o header contem um token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token=req.headers.authorization.split(" ")[1].toString()}
    console.log(token);
    if (!token){
return next(new ErrorApi(`token  Not Found`, 500)); 
    }
    const decoded = jwt.verify(token, process.env.JWT_USERTOKEN);
    console.log(decoded);
    const user=await User.findById(decoded.user)
    console.log(user,"protect user");
    if(user){
      let passChangedTimestamp;
       if (user.passwordChangedAt) {
          passChangedTimestamp = parseInt(
           user.passwordChangedAt.getTime() / 1000,
           10
         );
       }
       if (passChangedTimestamp < decoded.iat) {
         return next(
           new ErrorApi(`${user} Password Changed Before Login`, 401)
         );
       }
      }
      else{
        return next(new ErrorApi(`User Not Found`, 500))}
      req.user=user;
          next(); 
    }
    )
    exports.toAllow=(...role)=>asyncHandler(async(req,res,next)=>{
if (!role.includes(req.user.role)){
    throw new ErrorApi(`You are not authorized to access this resource`,403)
  }
 next()
})
exports.ForgetPassword=asyncHandler(async(req,res,next)=>{
  let user;
  if(req.body.email){
     user=await User.findOne({email:req.body.email})
  }
  if(req.body.PhoneNumber){
     user=await User.findOne({PhoneNumber:req.body.PhoneNumber})
  } 
  if(!user){
    throw new ErrorApi('Email or PhoneNumber is invalid',422)
  }
  console.log(user);
  const resetCode = Math.floor(Math.random() * 1000000 + 1).toString();
  const hash=
  crypto
  .createHash('sha256')  
  .update(resetCode)
  .digest('hex');


  async function sendSMS() {
    await vonage.sms
      .send({ to, from, text })
      .then((resp) => {
        console.log("Message sent successfully");
        console.log(resp);
      })
      .catch((err) => {
        console.log("There was an error sending the messages.");
        console.error(err);
      });
  }

  sendSMS();
   user.resetCode= hash
   user.expires = Date.now() + +10 * 60 * 1000;
   user.isVerified=false
  await user.save()

  //   send email with code and link for password change
if(req.body.email){  try{
  await  SendEmail({
      email: user.email,
      subject: "Reset your password",
      message: `Hello ${user.name},\n You have requested a password reset.\n Your Code is :${resetCode}\n Please use it within the next`,
    });  
  } 
   catch (error) {
        user.resetCode = undefined;
        user.expires = undefined;
        user.isVerified = undefined; 
           await user.save();
           return next(new ApiError("There is an error in sending email", 500));
    }}
if(req.body.PhoneNumber){ 
    const from = "07706969698";
    await vonage.sms
      .send({from, to:`964${user.PhoneNumber}`, text:`Hello ${user.name},\n You have requested a password reset.\n Your Code is :${resetCode}\n Please use it within the next` })
      .then((resp) => {
        console.log("Message sent successfully");
        console.log(resp);
      })
      .catch((err) => {
        console.log("There was an error sending the messages.");
        console.error(err);
      });}
    res.status(200).json({message:"code sent"})    
})
exports.ResetCode=asyncHandler(async(req,res,next)=>{
  const hash = crypto.createHash("sha256").update(req.body.resetCode).digest("hex");
  const user=await User.findOne(
    { 
      resetCode:hash,
  expires:{$gt:Date.now()}
})
console.log(user);
if (!user) {
  user.resetCode = undefined;
  user.expires = undefined;
  user.isVerified = undefined; 
  throw new ErrorApi(`Invalid Code`,403 );
}
user.isVerified=true
await user.save()
return res.status(200).json({msg:"succed"})
}) 
exports.ChangePassword=asyncHandler(async(req,res,next)=>{
  let user
    if (req.body.PhoneNumber) {
      user = await User.findOne({ phone: req.body.PhoneNumber });
    }
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    }
  if(!user){
    throw new ErrorApi (`User not found `,404 )
  }
  console.log(user);
  if (!user.isVerified) {
    throw new ErrorApi ("Please verify first ",409)
  }
  user.password=req.body.newPassword
  user.resetCode = undefined;
user.expires = undefined;
user.isVerified = undefined; 
await user.save() 
  const token=jwt.sign({user:user._id}, process.env.JWT_USERTOKEN, {
      expiresIn: process.env.JWT_EXPIER,
    });

   res.status(200).json({ token });
  })
  exports.ActivationSend = asyncHandler(async (req, res, next) => {
    let user;
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    }
    if (req.body.PhoneNumber) {
      user = await User.findOne({ PhoneNumber: req.body.PhoneNumber });
    } 
    if (!user) {
      throw new ErrorApi("Email or PhoneNumber is invalid", 422);
    }
   
    const resetCode = Math.floor(Math.random() * 1000000 + 1).toString();
    const hash = crypto.createHash("sha256").update(resetCode).digest("hex");

    async function sendSMS() {
      await vonage.sms
        .send({ to, from, text })
        .then((resp) => {
          console.log("Message sent successfully");
          console.log(resp);
        })
        .catch((err) => {
          console.log("There was an error sending the messages.");
          console.error(err);
        });
    }

    sendSMS();
    user.resetCode = hash;
    user.expires = Date.now() + +10 * 60 * 1000;
    user.isVerified = false;
    await user.save();

    //   send email with code and link for password change
    if (req.body.email) {
      try {
        SendEmail({
          email: user.email,
          subject: "Reset your password",
          message: `Hello ${user.name},\n You have requested a password reset.\n Your Code is :${resetCode}\n Please use it within the next`,
        });
        
      } catch (error) {
        user.resetCode = undefined;
        user.expires = undefined;
        user.isVerified = undefined;
        await user.save();
        return next(new ApiError("There is an error in sending email", 500));
      }
    }
    if (req.body.PhoneNumber) {
      const from = "07706969698";
      await vonage.sms
        .send({
          from,
          to: `964${user.PhoneNumber}`,
          text: `Hello ${user.name},\n You have requested a password reset.\n Your Code is :${resetCode}\n Please use it within the next`,
        })
        .then((resp) => {
          console.log("Message sent successfully");
          console.log(resp);
        })
        .catch((err) => {
          console.log("There was an error sending the messages.");
          console.error(err);
        });
    }
 
    res.status(200).json({ message: "code sent" });
  });
  exports.ActivationCode = asyncHandler(async (req, res, next) => {
    const hash = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");
    const user = await User.findOne({
      resetCode: hash,
      expires: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      user.resetCode = undefined;
      user.expires = undefined;
      user.isVerified = undefined;
      throw new ErrorApi(`Invalid Code`, 403);
    }
    user.isVerified = true;
    user.activation = true;
    await user.save();
    return res.status(200).json({ msg: "succed" });
  }); 