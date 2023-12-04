const express=require("express")
const userRouter=express.Router()
const {allUsers,editUserProfile,updatePassword,deleteUserSelfProfile}=require("../controllers/user.controller")
const authVarify = require("../middlewheres/auth.varify")

userRouter.get('/all-users',allUsers)
userRouter.post('/singleUser-edit-details',authVarify,editUserProfile)
userRouter.post('/singleUser-edit-password',authVarify,updatePassword)
userRouter.post('/singleUser-delete-account/:userId',authVarify,deleteUserSelfProfile)
module.exports=userRouter