const { default: mongoose } = require("mongoose");

const Iraq=new mongoose.Schema({
    NameCollege:{
        type:String,
        required:[true,"must be have name college"],

    },
    place:{
        type : String ,
        required:[true,"must be input place"]
    }
})