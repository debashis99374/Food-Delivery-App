const mongoose=require("mongoose")
//const URI="mongodb://127.0.0.1:27017/mern_admin"
const URI=process.env.MONGO_URI;

mongoose
.connect(URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
.then(()=>{
  console.log("mongodb connected")
})
.catch((err)=>{
 console.error("error occured",err)
})