const express=require("express")
const userRouter=express.Router()
const {allUsers,editUserProfile,updatePassword,deleteUserSelfProfile,addAddress,updateAddress,deleteAddress,addorder,removeOrder,addToFavourate,removeFromFavourate}=require("../controllers/user.controller")
const authVarify = require("../middlewheres/auth.varify")
//general profile related routes
userRouter.get('/all-users',allUsers)
userRouter.post('/singleUser-edit-details',authVarify,editUserProfile)
userRouter.post('/singleUser-edit-password',authVarify,updatePassword)
userRouter.post('/singleUser-delete-account/:userId',authVarify,deleteUserSelfProfile)

//address related routes
userRouter.post('/singleUser/address/add-address',authVarify,addAddress)
userRouter.post('/singleUser/address/update-address/:addressId',authVarify,updateAddress)
userRouter.post('/singleUser/address/delete-address/:addressId',authVarify,deleteAddress)

//order related routes
userRouter.post('/singleUser/order/addOrder',authVarify,addorder)
userRouter.post('/singleUser/order/removeOrder/:orderId',authVarify,removeOrder)


//favourate related routes

userRouter.post('/singleUser/favourate/add/:restaurantId',authVarify,addToFavourate)
userRouter.post('/singleUser/favourate/remove/:favourateId',authVarify,removeFromFavourate)



module.exports=userRouter