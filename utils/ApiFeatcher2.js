class ApiFeather2{
    constructor(query,MongoDb2){
        this.query = query;
        this.MongoDb2 = MongoDb2;
    }
    filter(){
        const queryStr={...this.query}
        const exclude=["page", "fields", "limit", "sort", "keyword"];
        console.log(queryStr);
        exclude.forEach((element) => {
            delete queryStr[element]
        });
        const QueryStr=JSON.stringify(queryStr)
        const Query=QueryStr.replace(/\b(gr|gte|lte|lt|eq)\b/g,(match=>{
            return `$${match}`
        }))
        this.MongoDb2 = this.MongoDb2.find(JSON.parse(Query));
return this
    }
    paging(countDocuments){
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
        
        this.MongoDb2=this.MongoDb2.limit().skip()
        this.paginationResult=this.pagination
    return this
    }
    
}
module.exports = ApiFeather2;