const Restaurant2 = require("../models/restaurant.model")
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
       return res.status(500).json({message:`error is : ${err}`})
    }
}
//address related controllers

const addAddress=async(req,res)=>{
    const userId=req.user._id
    const {street}=req.body

    try{
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        if(!foundUser){
            return  res.status(400).json({message:"user not found"}) 
        }
        foundUser.addresses.push({street})
        await foundUser.save();
        return res.status(200).json({message:"new address added",data:foundUser})

    }catch(err){
       return res.status(500).json({message:`error is : ${err}`})  
    }
}
//edit a address
const updateAddress=async(req,res)=>{
    const userId=req.user._id
    const addressId=req.params.addressId
    const editedAddress=req.body
    try{
        if(!addressId){
            return  res.status(401).json({message:"enter valid address id"}) 
        }
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        if(!foundUser){
            return  res.status(400).json({message:"user not found"}) 
        }
        foundUser.addresses=foundUser.addresses.map((el)=>el._id.toString()===addressId?{...el,...editedAddress}:el)
        await foundUser.save()
        return res.status(200).json({message:"Address updated ",data:foundUser})


    }catch(err){
       return res.status(500).json({message:`error is : ${err}`})  
    }
}
//delete a address
const deleteAddress=async(req,res)=>{
    const userId=req.user._id
    const addressId=req.params.addressId
    try{
        if(!addressId){
            return  res.status(401).json({message:"enter valid address id"}) 
        }
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        if(!foundUser){
            return  res.status(400).json({message:"user not found"}) 
        }
        const foundAddress=foundUser.addresses.find((el)=>el._id.toString()===addressId)
        foundUser.addresses.pull(foundAddress)
        await foundUser.save()
        return res.status(200).json({message:"Address deleted ",data:foundUser})
    }catch(err){
       return res.status(500).json({message:`error is : ${err}`})  
    }
}
//order related controllers
const addorder=async(req,res)=>{
    const userId=req.user._id
    const orderDetails=req.body
    try{
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        if(!foundUser){
            return  res.status(400).json({message:"user not found"}) 
        }
        foundUser.orders.push(orderDetails)
        await foundUser.save()
        return res.status(200).json({message:"Order Placed ",data:foundUser})

    }catch(err){
       return res.status(500).json({message:`error is : ${err}`})  
    }
}
//remove an order

const removeOrder=async(req,res)=>{
    const userId=req.user._id
    const orderId=req.params.orderId
    try{
        if(!orderId){
            return  res.status(401).json({message:"enter valid order id"}) 
        }
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        if(!foundUser){
            return  res.status(400).json({message:"user not found"}) 
        }
        const foundOrder=foundUser.orders.find((el)=>el._id.toString()===orderId)
        foundUser.orders.pull(foundOrder)
        await foundUser.save()
        return res.status(200).json({message:"Order removed ",data:foundUser})

    }catch(err){
       return res.status(500).json({message:`error is : ${err}`})  
    }
}
//favourate restaurant related controllers
const addToFavourate=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId

    try{
        
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundUser){
            return  res.status(400).json({message:"user not found"}) 
        }
        if(!foundRestaurant){
            return  res.status(400).json({message:"user not found"}) 
        }
        foundUser.favourates.push(foundRestaurant)
        await foundUser.save()
        return res.status(200).json({message:"Added to favourates",data:foundUser})


    }catch(err){
       return res.status(500).json({message:`error is : ${err}`})  
    }
}
//remove from favourates
const removeFromFavourate=async(req,res)=>{
    const userId=req.user._id
    const favourateId=req.params.favourateId
    try{
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        
        if(!foundUser){
            return  res.status(400).json({message:"user not found"}) 
        }
        const foundRestaurant=foundUser.favourates.find((el)=>el._id.toString()===favourateId)
        foundUser.favourates.pull(foundRestaurant)
        await foundUser.save()
        return res.status(200).json({message:"Removed from favourates",data:foundUser})

    }catch(err){
       return res.status(500).json({message:`error is : ${err}`})  
    }
}

module.exports={
    allUsers,
    editUserProfile,
    updatePassword,
    deleteUserSelfProfile,
    //address related 
    addAddress,
    updateAddress,
    deleteAddress,
    //order related
    addorder,
    removeOrder,
    //favourate related
    addToFavourate,
    removeFromFavourate
}