

//in this page we are doing admin control pannel

const OfferForFoodDelevery = require("../models/offers.model")
const UserForFoodDeliveryApp = require("../models/user.model")
//toggle admin status
const toggleAdmin=async(req,res)=>{
    const userId=req.user._id
    const userId2=req.body._id
    const adminValue=req.body.isAdmin
    try{
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        const userToBeToggled=await UserForFoodDeliveryApp.findById(userId2)
        if(!loggedInUser){
           return res.status(400).json({message:"you are not logged in"})
        }
        if(loggedInUser.isAdmin===false){
            return res.status(401).json({message:"Unauthorised:only admins can make anyone admin or not"})
        }
        if(loggedInUser._id==userToBeToggled._id){
            return res.status(402).json({message:"Unauthorised:you cant toggle yourself as admin"})
        }
        const updatedUser=await UserForFoodDeliveryApp.findByIdAndUpdate(userId2,{isAdmin:adminValue},{new:true})
        const action = adminValue ? "granted admin privileges" : "revoked from admin privileges";
        return res.status(200).json({message:`${updatedUser.firstName} ${action}`,data:updatedUser})


    }catch(err){
        res.status(500).json({message:`error is : ${err}`})
    }
}
//toggle restaurant Owner status
const toggleRestaurantOwner=async (req,res)=>{
    const userId=req.user._id
    const userId2=req.body._id
    const ownerValue=req.body.restaurantOwner
    try{
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        
        if(!loggedInUser){
            return res.status(400).json({message:"you are not logged in"})
         }
         if(loggedInUser.isAdmin===false){
             return res.status(401).json({message:"Unauthorised:only admins can make anyone restaurant owner or not"})
         }
         const updatedUser=await UserForFoodDeliveryApp.findByIdAndUpdate(userId2,{restaurantOwner:ownerValue},{new:true})
         const action = ownerValue ? "is restaurant owner" : "is not restaurant owner";
         return res.status(200).json({message:`${updatedUser.firstName} ${action}`,data:updatedUser})

    }catch(err){
        res.status(500).json({message:`error is : ${err}`})
    }
}
//delete any user
const deleteUser=async(req,res)=>{
    const userId=req.user._id
    const userId2=req.body._id
    try{
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        const userToBeDeleted=await UserForFoodDeliveryApp.findById(userId2)
        if(!loggedInUser){
            return res.status(400).json({message:"you are not logged in"})
         }
         if(loggedInUser.isAdmin===false){
             return res.status(401).json({message:"Unauthorised:only admins can delete any account"})
         }
         if(loggedInUser._id.equals(userToBeDeleted._id)){
            return res.status(402).json({message:"Unauthorised:you cant delete your own account"})
        }
         const deletedUser=await UserForFoodDeliveryApp.findByIdAndDelete(userId2)
         return res.status(200).json({message:`${deletedUser.firstName}'s account deleted`,data:deletedUser})

    }catch(err){
        
        res.status(500).json({message:`error is : ${err}`}) 
    }
}
//coupone code related controllers
//all coupons/offers
const allCoupons=async(req,res)=>{
    try{
        const allCoupons=await OfferForFoodDelevery.find({})
        if(!allCoupons){
            return res.status(400).json({message:"cant fetch all coupons"})
        }
        return res.status(200).json({message:`All coupons are:`,data:allCoupons})

    }catch(err){
        
        res.status(500).json({message:`error is : ${err}`}) 
    }
}
//create a coupon
const createCoupon=async(req,res)=>{
    const userId=req.user._id
    const {name,discountAmount}=req.body
    try{
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        if(!loggedInUser){
            return res.status(400).json({message:"you are not logged in"})
         }
         if(loggedInUser.isAdmin===false){
             return res.status(401).json({message:"Unauthorised:only admins can create a coupon"})
         }
         const newCoupon=await OfferForFoodDelevery.create({name,discountAmount})
         return res.status(200).json({message:`New coupone code added`,data:newCoupon})

    }catch(err){
        
        res.status(500).json({message:`error is : ${err}`}) 
    }
}
//delete a coupon

const deleteCoupon=async(req,res)=>{
    const userId=req.user._id
    const couponId=req.body._id
    try{
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        const foundCoupon=await OfferForFoodDelevery.findById(couponId)
        if(!loggedInUser){
            return res.status(400).json({message:"you are not logged in"})
         }
         if(loggedInUser.isAdmin===false){
             return res.status(401).json({message:"Unauthorised:only admins can delete a coupon"})
         }
         if(!foundCoupon){
            return res.status(400).json({message:"coupon not found"})
         }
         const deletedCoupon=await OfferForFoodDelevery.findByIdAndDelete(couponId)

return res.status(200).json({message:`Coupon deleted`,data:deletedCoupon})
    }catch(err){
        
        res.status(500).json({message:`error is : ${err}`}) 
    }
}


module.exports={
    toggleAdmin,
    toggleRestaurantOwner,
    deleteUser,
    //offer related
    allCoupons,
    createCoupon,
    deleteCoupon
}