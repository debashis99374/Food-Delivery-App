

//in this page we are doing admin control pannel

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
        const userToBeToggled=await UserForFoodDeliveryApp.findById(userId2)
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


module.exports={
    toggleAdmin,
    toggleRestaurantOwner
}