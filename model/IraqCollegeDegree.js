
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
// const User = require("./user");

const degreeCollege = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "it is require"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    degree: {
      type: Number,
      required: [true, "it is require"],
    },
    place: {
      type: String,
      default: "عراق",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    collegeName: {
      type: String,
      required: [true, "it is require"],
    },
    sex: {
      type: Number, //0 male and  1 female
      required: [true, "must input the sex"],
      enum: [0, 1, 2],
      default:2
    },
    TypeCollege: {
      type: mongoose.Schema.ObjectId,
      ref: "TypeCollege",
      required: [true, "it is required"],
    },
  },
  { timestamps: true }
);
degreeCollege.pre(/^find/, function(next){
    this.populate({ path: "TypeCollege", select: "name-_id" });
    next()
});
const Degrees=mongoose.model("Degrees",degreeCollege)
module.exports=Degrees