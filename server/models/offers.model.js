const mongoose=require("mongoose")
const offerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
  discountAmount:{
    type:Number,
    required:true
}
})
const OfferForFoodDelevery=new mongoose.model("OfferForFoodDelevery",offerSchema)
module.exports=OfferForFoodDelevery