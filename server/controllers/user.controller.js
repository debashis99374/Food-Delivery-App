const UserForFoodDeliveryApp = require("../models/user.model")
const bcrypt=require("bcrypt")

//all users
const allUsers=async(req,res)=>{
    try{
        const allUsers=await UserForFoodDeliveryApp.find({})
        if(!allUsers){
            res.status(400).json({message:"cant fetch all users"}) 
        }
        res.status(200).json({message:"All users:",data:allUsers})

    }catch(err){
        res.status(500).json({message:`error is : ${err}`})
    }
}

//edit user profile
const editUserProfile=async(req,res)=>{
    const userId=req.user._id
    const editedData=req.body
    try{
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        if(!foundUser){
            res.status(400).json({message:"user not found"})
        }
        const updatedUser=await UserForFoodDeliveryApp.findByIdAndUpdate(userId,editedData,{new:true})
        res.status(200).json({message:"user updated",data:updatedUser})

    }catch(err){
        res.status(500).json({message:`error is : ${err}`})
    }
}
//update password
const updatePassword=async(req,res)=>{
    const userId=req.user._id
    const {currentPassword,newPassword}=req.body
    try{
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        if(foundUser){
            const validatePassword=await bcrypt.compare(currentPassword,foundUser.password)
            if(validatePassword){
                const hashedPassword=await bcrypt.hash(newPassword,10)
                const updatedUser=await UserForFoodDeliveryApp.findByIdAndUpdate(userId,{password:hashedPassword},{new:true})
                return res.status(200).json({message:"password updated",data:updatedUser})
            }
           
        }else{
            return  res.status(400).json({message:"user not found"})
        }

    }catch(err){
        res.status(500).json({message:`error is : ${err}`})
    }
}
//delete user profile
const deleteUserSelfProfile=async(req,res)=>{
    const userId=req.user._id
    const userId2=req.user.userId
    try{
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        if(!loggedInUser){
            return  res.status(400).json({message:"user not loggedin"}) 
        }
        if(loggedInUser._id.toString()!==userId2){
            return  res.status(401).json({message:"you cant delete someone else account"}) 
        }
      const deletedAccount=await UserForFoodDeliveryApp.findByIdAndDelete(userId2)
      return res.status(200).json({message:"password updated",data:deletedAccount})

    }catch(err){
        res.status(500).json({message:`error is : ${err}`})
    }
}

module.exports={
    allUsers,
    editUserProfile,
    updatePassword,
    deleteUserSelfProfile
}