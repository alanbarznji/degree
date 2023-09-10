class ApiFeather{
    constructor(query,MongoDb){
        this.query = query;
        this.MongoDb = MongoDb;
    }
    filter(){
        const queryStr={...this.query}
        const exclude=["page", "fields", "limit", "sort", "keyword"];
        console.log(queryStr);
        exclude.forEach((element) => {
            delete queryStr[element]
        });
        const QueryStr=JSON.stringify(queryStr)
        const Query=QueryStr.replace(/\b(gr|gte|lte|lt)\b/g,(match=>{
            return `$${match}`
        }))
        this.MongoDb = this.MongoDb.find(JSON.parse(Query));
return this
    }
    paging(countDocuments){
        console.log(this.query);
const limit=this.query.limit *1||50
const page=this.query.page* 1||1;
const skip=(page- 1)*limit 
const endIndex=page*limit
const pagination={
    total:countDocuments,
    limit:limit,
    page:page,
}
if (endIndex< countDocuments ){
    pagination.next=page-1
    };
    if (skip>0 ){
        pagination.prev=page+1};
        
        this.MongoDb=this.MongoDb.limit().skip()
        this.paginationResult=this.pagination
    return this
    }
    
}
module.exports=ApiFeather