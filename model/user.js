const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: [true, "must be input your name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    require: [true, "must be input your name"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "must be input your name"],
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  resetCode: String,
  isVerified: Boolean,
  expires: Date,
  PhoneNumber: {
    type: String,
    require: [true, "must be input your name"],
    unique: true,
  },
  Years: Date,
  Study: String,
  place: {
    type: String,
    require: [true, "must be input your place"],
    enum: ["كوردستان", "عراق"],
  },
  governorate: {
    type: String,
    required: [true, "it is required"],
    enum: [
      "بغداد",
      "البصرة",
      "النجف",
      "ذي قار",
      "المثنى",
      "القادسية",
      "بابل",
      "واسط",
      "ميسان",
      "الديوانية",
      "كربلاء",
      "النجف الأشرف",
      "ديالى",
      "صلاح الدين",
      "نينوى",
      "كركوك",
      "دهوك",
      "أربيل",
      "الأنبار",
      "السليمانية",
    ],
  },
  LanguageStudy:{
    type :String ,
    enum:["عربي","كردي","اخري"],
    required:[true,"must required"]
  },
  sex: {
    type: Number, //0 male and  1 female
    required: [true, "must input the sex"],
    enum: [0, 1],
  },
  activation:{
    type:Boolean,
    default:false,
  }
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 14);
  }
  next(); 
});

// Add a pre hook for findOneAndUpdate and updateOne
UserSchema.pre(/^findOneAndUpdate|updateOne/, async function (next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 14);
  }
  next();
});


const User = mongoose.model("User", UserSchema);
module.exports = User;
