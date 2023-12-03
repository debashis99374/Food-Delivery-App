const jwt=require("jsonwebtoken")
const UserForFoodDeliveryApp = require("../models/user.model")

const authVarify=async(req,res,next)=>{
    const token=req.headers.authorization
    try{
        if(!token){
            return  res.status(401).json({message:"token missing"})
        }
        const decoded=jwt.verify(token,process.env.JWT_KEY)
        const foundUser=await UserForFoodDeliveryApp.findById(decoded.userId)
        if(!foundUser){
            return  res.status(400).json({message:"user missing"})
        }
        req.user=foundUser
        return next()

    }catch(err){
        return res.status(500).json({ errorMessage: "Unauthorised access, please add the token",error })
    }
}

module.exports=authVarify