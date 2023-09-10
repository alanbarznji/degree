const { default: mongoose } = require("mongoose");

const TypeCollegeSchema=new mongoose.Schema({
    name:{type:String,required:true},
    slug:{type:String,
        // required:true
    },
},
{timestamps : true}
)

const Type=mongoose.model("TypeCollege",TypeCollegeSchema)
module.exports=Type;