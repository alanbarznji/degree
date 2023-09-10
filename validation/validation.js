const { validationResult } = require("express-validator")

const Validation=(req,res,next)=>{
 const errors=validationResult(req)
if(!errors.isEmpty()){
return res.status(400).json({ error: errors.array() });
}
next()
}
module.exports=Validation