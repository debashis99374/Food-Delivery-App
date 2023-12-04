const express=require("express")
const restaurantRouter=express.Router()
const {allRestaurant,createRestaurant,updateRestaurant,deleteRestaurant,addItemToMenu,editMenuItem,deleteMenuItem,increaseMenuItemQuanity,decreaseMenuItemQuanity,addOffer,removeOffer,addReview,editReview,removeReview,addTag,removeTag}=require("../controllers/restaurant.controller")
const authVarify = require("../middlewheres/auth.varify")

//general restaurant related routes
restaurantRouter.get('/restaurant/all-restaurants',allRestaurant)
restaurantRouter.post('/restaurant/create-a-restaurant',authVarify,createRestaurant)
restaurantRouter.post('/restaurant/update-a-restaurant',authVarify,updateRestaurant)
restaurantRouter.post('/restaurant/delete-a-restaurant',authVarify,deleteRestaurant)
//menu related routes
restaurantRouter.post('/restaurant/:restaurantId/menu/add-item',authVarify,addItemToMenu)
restaurantRouter.post('/restaurant/:restaurantId/menu/edit-item/:menuItemId',authVarify,editMenuItem)
restaurantRouter.post('/restaurant/:restaurantId/menu/delete-item/:menuItemId',authVarify,deleteMenuItem)
restaurantRouter.post('/restaurant/:restaurantId/menu/increase-quantity/:menuItemId',authVarify,increaseMenuItemQuanity)
restaurantRouter.post('/restaurant/:restaurantId/menu/decrease-quantity/:menuItemId',authVarify,decreaseMenuItemQuanity)

//offers related routes
restaurantRouter.post('/restaurant/:restaurantId/offer/add-offer/:offerId',authVarify,addOffer)
restaurantRouter.post('/restaurant/:restaurantId/offer/remove-offer/:offerId',authVarify,removeOffer)

//review related routes
restaurantRouter.post('/restaurant/:restaurantId/reviews/add-review',authVarify,addReview)
//here we are making some advance edit review functionality as we are checking if the loggedin user is the owner of the perticular review and updating the perticular review
restaurantRouter.post('/restaurant/:restaurantId/reviews/edit-review/user/:userId/:reviewId',authVarify,editReview)
restaurantRouter.post('/restaurant/:restaurantId/reviews/remove-review/user/:userId/:reviewId',authVarify,removeReview)

//tag related
restaurantRouter.post('/restaurant/:restaurantId/tags/add-tag',authVarify,addTag) 
restaurantRouter.post('/restaurant/:restaurantId/tags/remove-tag',authVarify,removeTag) 


module.exports=restaurantRouter      