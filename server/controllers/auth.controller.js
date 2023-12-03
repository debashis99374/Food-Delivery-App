
const UserForFoodDeliveryApp=require('../models/user.model')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
//password is ${userName}123 for just own remembring
//signup controller

const signup=async(req,res)=>{
    const { firstName, lastName, email,phoneNumber, password } = req.body;
    try{
        const existingUser=await UserForFoodDeliveryApp.findOne({email})
        if(existingUser){
            res.status(400).json({message:"User already exists,try with new email"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=await UserForFoodDeliveryApp.create({ firstName, lastName, email,phoneNumber, password:hashedPassword })
        const token=jwt.sign({userId:newUser._id},process.env.JWT_KEY,{expiresIn:"100d"})
        res.status(200).json({message:"Registration Succesful",token,data:newUser})
        

    }catch(err){
        res.status(500).json({message:`check it: ${err}`})
    }
}
//login controller
const login=async(req,res)=>{
    const {email,password}=req.body
    try{
        const foundUser=await UserForFoodDeliveryApp.findOne({email})
        if(foundUser){
            const varifyPassword=await bcrypt.compare(password,foundUser.password)
            if(varifyPassword){
            const token=jwt.sign({userId:foundUser._id},process.env.JWT_KEY,{expiresIn:"100d"})
            return res.status(200).json({message:`log in succesful for ${foundUser.firstName}`,token,foundUser})
            }else{
                return res.status(401).json({message:"incorrect password"})
            }

        }else{
            return res.status(400).json({message:"user not found"})
        }

    }catch(err){
        res.status(500).json({message:`check it: ${err}`})
    }

}

module.exports={
    signup,
    login
}