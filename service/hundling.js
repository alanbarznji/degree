const asyncHandler = require("express-async-handler");
const ErrorApi = require("../utils/ErroreApi");
exports.GetAll = (Model) => asyncHandler(async (req,res,next)=>{
    let filter = {};
    if (req.filterObj) {
      console.log(req.filterObj);
      filter = req.filterObj;
    }
    const count = await Model.countDocuments()
    const data=await Model.find(filter)
    const page=req.query.page *1||1
    const limit=req.query.limit *1||50
    const skip=(page-1)*limit
    const Index=page*limit
    //Pagination

    let CurrentPage=page
    let limits=limit
    let totalPages=Math.ceil((count+skip)/limit)//total pages
    const Pagination={
        Current_Page:CurrentPage,//current page number
        limit:limits,
        Total_pages:totalPages//total no of pages
    }
    if(Index<count){
    Pagination.next=page+1
    }
    if(skip>page ){
        Pagination.prev=page - 1
        }
    
    res.status(201).json({Pagination, result: data.length, data: data });
})
exports.GetOne=(Model)=>asyncHandler(async (req,res,next)=>{
    const data=await Model.findById(req.params.id)
    if(!data){
        return next(new ErrorApi("it is not true id"))
    }
    return res.status(201).json({data:data})
})
exports.UpdateOne=(Model)=>asyncHandler(async (req,res,next)=>{
    const data = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new :true }
    );
    if(!data){
        return next(new ErrorApi("it is not true id"))
    }
    return res.status(201).json({data:data})
})
exports.DeleteOne=(Model)=>asyncHandler(async (req,res,next)=>{
    const data = await Model.findByIdAndDelete(
        req.params.id,
        req.body,
        { new :true }
    );
    if(!data){
        return next(new ErrorApi("it is not true id"))
    }
    return res.status(201).json({data:data})
})
exports.CreateOne=(Model)=>asyncHandler(async(req,res,next)=>{
    const data=await Model.create(req.body);
       res.status(201).json({result:"success",data});
})