

const express=require('express')
const adminRouter=express.Router()
const {toggleAdmin,toggleRestaurantOwner,deleteUser,allCoupons,createCoupon,deleteCoupon}=require('../controllers/admin.controller')
const authVarify = require('../middlewheres/auth.varify')
//admins toggle related routes
adminRouter.post('/admin-toggleAdmin',authVarify,toggleAdmin)
adminRouter.post('/admin-toggleRestaurant-owner',authVarify,toggleRestaurantOwner)
adminRouter.post('/admin-delete-user',authVarify,deleteUser)

//admins coupon/offer related routes
adminRouter.get('/admin-all-offers',allCoupons)
adminRouter.post('/admin-create-a-offer',authVarify,createCoupon)
adminRouter.post('/admin-delete-a-offer',authVarify,deleteCoupon)

module.exports=adminRouter