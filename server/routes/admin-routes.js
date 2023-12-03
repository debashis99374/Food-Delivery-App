

const express=require('express')
const adminRouter=express.Router()
const {toggleAdmin,toggleRestaurantOwner}=require('../controllers/admin.controller')
const authVarify = require('../middlewheres/auth.varify')
adminRouter.post('/admin-toggleAdmin',authVarify,toggleAdmin)
adminRouter.post('/admin-toggleRestaurant-owner',authVarify,toggleRestaurantOwner)

module.exports=adminRouter