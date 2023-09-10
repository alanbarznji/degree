const UserRouter=require("./user")
const servers=(app)=>{
    app.use("/api/v1/user",UserRouter)
}
module.exports =servers