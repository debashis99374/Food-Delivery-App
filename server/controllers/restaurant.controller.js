


const Restaurant2 = require("../models/restaurant.model")
const UserForFoodDeliveryApp = require("../models/user.model")
//overall restaurant related controllers
//get all restaurant
const allRestaurant=async(req,res)=>{
    try{
        const allRestaurants=await Restaurant2.find({})
        if(!allRestaurants){
            return res.status(400).json({message:"cant fetch all restaurants"})
        }
        return res.status(200).json({message:"all restaurants are:",data:allRestaurants})

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//create a restaurant
const createRestaurant=async(req,res)=>{
    const userId=req.user._id
    const {name,description,deliveryTime,tags}=req.body
    try{
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        if(!foundUser){
            return res.status(400).json({message:"user not found"})
        }
        if(!foundUser.restaurantOwner){
            return res.status(400).json({message:"Unauthorised: only owners can create a restaurant"})
        }
        const newRestaurant=await Restaurant2.create({name,description,deliveryTime,creater:userId,tags})
        return res.status(200).json({message:"New restaurant created:",data:newRestaurant})


    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//edit restaurant details

const updateRestaurant=async(req,res)=>{
    const userId=req.user._id
    const {name,description,deliveryTime,_id,tags}=req.body
    try{
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(_id)
        
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(402).json({message:"user not found"})
        }
        if(!foundUser.restaurantOwner){
            return res.status(400).json({message:"Unauthorised: only owners can update a restaurant"})
        }
        if(foundUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(401).json({message:"Unauthorised: only owner of this restaurant can update the restaurant"})
        }
        const updatedRestaurant=await Restaurant2.findByIdAndUpdate(foundRestaurant._id,{name,description,deliveryTime},{new:true})
        return res.status(200).json({message:" restaurant updated:",data:updatedRestaurant})
    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}

//delete a restaurant

const deleteRestaurant=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.body._id
    try{
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(400).json({message:"user not found"})
        }
        if(!foundUser.restaurantOwner){
            return res.status(402).json({message:"Unauthorised: only owners can delete a restaurant"})
        }
        if(foundUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(401).json({message:"Unauthorised: only owner of this restaurant can delete this restaurant"})
        }
        const deletedRestaurant=await Restaurant2.findByIdAndDelete(restaurantId)
        return res.status(200).json({message:" restaurant deleted:",data:deletedRestaurant})

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//menu related controllers-----------------------------------
const addItemToMenu=async(req,res)=>{
    const userId=req.user._id
    const {name,price}=req.body
    const restaurantId=req.params.restaurantId
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(400).json({message:"user not found"})
        }
        if(!foundUser.restaurantOwner){
            return res.status(402).json({message:"Unauthorised: only owners can add a dish to a  restaurant"})
        }
        if(foundUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(401).json({message:"Unauthorised: only owner of this restaurant add a dish to this restaurant"})
        }
       foundRestaurant.menu.push({name,price})
        await foundRestaurant.save();
        return res.status(200).json({message:`${name} added to the menu`,data:foundRestaurant})


    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//edit item from menu
const editMenuItem=async(req,res)=>{
    const userId=req.user._id
    const editedData=req.body
    const restaurantId=req.params.restaurantId
    const menuItemId=req.params.menuItemId
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        if(!menuItemId){
            return res.status(405).json({message:"menuItemId not found"})
        }
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(400).json({message:"user not found"})
        }
        if(!foundUser.restaurantOwner){
            return res.status(402).json({message:"Unauthorised: only owners can update a dish to a  restaurant"})
        }
        if(foundUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(401).json({message:"Unauthorised: only owner of this restaurant can update this dish"})
        }
        foundRestaurant.menu=foundRestaurant.menu.map((el)=>el._id.toString()===menuItemId?{...el,...editedData}:el)
         await foundRestaurant.save()
         return res.status(200).json({message:`${foundRestaurant.name}'s menu updated`,data:foundRestaurant})

        

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//delete a menu item controller
const deleteMenuItem=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const menuItemId=req.params.menuItemId
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        if(!menuItemId){
            return res.status(405).json({message:"menuItemId not found"})
        }
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(400).json({message:"user not found"})
        }
        if(!foundUser.restaurantOwner){
            return res.status(402).json({message:"Unauthorised: only owners can delete a dish of  a  restaurant"})
        }
        if(foundUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(401).json({message:"Unauthorised: only owner of this restaurant can delete this dish"})
        }
        const restuarantToBeDeleted=foundRestaurant.menu.find((el)=>el._id.toString()===menuItemId)
         foundRestaurant.menu.pull(restuarantToBeDeleted)
         await foundRestaurant.save()
        return res.status(200).json({message:`${restuarantToBeDeleted.name} item deleted from the menu`,data:foundRestaurant})

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//increase quanity of the menu item controller--------

const increaseMenuItemQuanity=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const menuItemId=req.params.menuItemId
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        if(!menuItemId){
            return res.status(405).json({message:"menuItemId not found"})
        }
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(400).json({message:"login required "})
        }
        foundRestaurant.menu=foundRestaurant.menu.map((el)=>el._id.toString()===menuItemId?{...el,quantity:el.quantity+1}:el)
        await foundRestaurant.save()
        return res.status(200).json({message:`added`,data:foundRestaurant})

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//decrease a menu items quantity
const decreaseMenuItemQuanity=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const menuItemId=req.params.menuItemId
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        if(!menuItemId){
            return res.status(405).json({message:"menuItemId not found"})
        }
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(400).json({message:"login required "})
        }
        foundRestaurant.menu=foundRestaurant.menu.map((el)=>el._id.toString()===menuItemId?{...el,quantity:el.quantity-1}:el)
        await foundRestaurant.save()
        return res.status(200).json({message:`decreased`,data:foundRestaurant})

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}

//restaurant offer related controllers--------------------------------------------
//add a offer/coupon to restaurant
const addOffer=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const offerId=req.params.offerId
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        if(!offerId){
            return res.status(405).json({message:"offerId not found"})
        }
       
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(400).json({message:"user not found"})
        }
        if(!foundUser.restaurantOwner){
            return res.status(402).json({message:"Unauthorised: only owners can add a offer/coupon to  a  restaurant"})
        }
        if(foundUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(401).json({message:"Unauthorised: only owner of this restaurant can add a offer/coupon to this restaurant"})
        }
        if (!offerId) {
            return res.status(400).json({ message: "Offer ID is required" });
        }

        
        foundRestaurant.offers.push({ offerId });

        
        await foundRestaurant.save();

        return res.status(200).json({ message: "Offer added to the restaurant", data: foundRestaurant }); 


    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//remove an offer from the restaurant

const removeOffer=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const offerId=req.params.offerId
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        if(!offerId){
            return res.status(405).json({message:"offerId not found"})
        }
        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundRestaurant){
            return res.status(403).json({message:"restaurant not found"})
        }
        if(!foundUser){
            return res.status(400).json({message:"user not found"})
        }
        if(!foundUser.restaurantOwner){
            return res.status(402).json({message:"Unauthorised: only owners can add a offer/coupon to  a  restaurant"})
        }
        if(foundUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(401).json({message:"Unauthorised: only owner of this restaurant can add a offer/coupon to this restaurant"})
        }
        if (!offerId) {
            return res.status(400).json({ message: "Offer ID is required" });
        }
        const findOffer=foundRestaurant.offers.find((el)=>el.offerId.toString()===offerId)
        foundRestaurant.offers.pull(findOffer)
        await foundRestaurant.save()
        return res.status(200).json({ message: "Offer removed from the restaurant", data: foundRestaurant });

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}

//restaurant review controllers-----
//add a review to the restaurant

const addReview=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const {reviewText,rating}=req.body
    try{

        const foundUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!foundUser){
            return res.status(400).json({message:"User not found"})
        }
        if(!foundRestaurant){
            return res.status(401).json({message:"Restaurant not found"})
        }
        foundRestaurant.reviews.push({userId,reviewText,rating})
        await foundRestaurant.save()
        return res.status(200).json({ message:`Review added to${foundRestaurant.name} `, data: foundRestaurant });


    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
//edit a review

const editReview=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const userId2=req.params.userId
    const reviewObjectId=req.params.reviewId
    const editedData=req.body
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        if(!userId2){
            return res.status(405).json({message:"userId2 not found"})
        }
        if(!reviewObjectId){
            return res.status(404).json({message:"reviewObjectId not found"})
        }
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!loggedInUser){
            return res.status(400).json({message:"User not found"})
        }
        if(!foundRestaurant){
            return res.status(401).json({message:"Restaurant not found"})
        }
        if(userId.toString()!==userId2.toString()){
            return res.status(402).json({message:"Unauthorised: you cant edit someone elses review"})
        }
        foundRestaurant.reviews=foundRestaurant.reviews.map((el)=>el._id.toString()===reviewObjectId?{...el,...editedData}:el)
        await foundRestaurant.save()

return res.status(200).json({ message:`Review edited `, data: foundRestaurant });
    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
// delete a review from the perticular review

const removeReview=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const userId2=req.params.userId
    const reviewObjectId=req.params.reviewId
    try{
        if(!restaurantId){
            return res.status(404).json({message:"restaurantId not found"})
        }
        if(!userId2){
            return res.status(405).json({message:"userId2 not found"})
        }
        if(!reviewObjectId){
            return res.status(404).json({message:"reviewObjectId not found"})
        }
        
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!loggedInUser){
            return res.status(400).json({message:"User not found"})
        }
        if(!foundRestaurant){
            return res.status(401).json({message:"Restaurant not found"})
        }
        if(userId.toString()!==userId2.toString()){
            return res.status(402).json({message:"Unauthorised: you cant delete someone elses review"})
        }
        const foundReview=foundRestaurant.reviews.find((el)=>el._id.toString()===reviewObjectId)
        foundRestaurant.reviews.pull(foundReview)
        await foundRestaurant.save()
        return res.status(200).json({ message:`Review deleted`, data: foundRestaurant });

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}

//add tags to the restaurant

const addTag=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const tagarray=req.body
    try{
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!loggedInUser){
            return res.status(400).json({message:"User not found"})
        }
        if(!foundRestaurant){
            return res.status(401).json({message:"Restaurant not found"})
        }
        if(!loggedInUser.restaurantOwner){
            return res.status(402).json({message:"Unauthorised:Only restaurant owner can add a tag"})
        }
        if(loggedInUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(402).json({message:"Unauthorised:Only owner of this restaurant can add tags  to this restaurant"})
        }
        const existingTagsSet=new Set(foundRestaurant.tags)

        tagarray.forEach(el=>existingTagsSet.add(el))
        foundRestaurant.tags=Array.from(existingTagsSet) 
        await foundRestaurant.save()
        return res.status(200).json({ message: "Tags added successfully", data: foundRestaurant});

        

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}
// remove a tag

const removeTag=async(req,res)=>{
    const userId=req.user._id
    const restaurantId=req.params.restaurantId
    const tagarray=req.body
    try{
        const loggedInUser=await UserForFoodDeliveryApp.findById(userId)
        const foundRestaurant=await Restaurant2.findById(restaurantId)
        if(!loggedInUser){
            return res.status(400).json({message:"User not found"})
        }
        if(!foundRestaurant){
            return res.status(401).json({message:"Restaurant not found"})
        }
        if(!loggedInUser.restaurantOwner){
            return res.status(402).json({message:"Unauthorised:Only restaurant owner can add a tag"})
        }
        if(loggedInUser._id.toString()!==foundRestaurant.creater.toString()){
            return res.status(402).json({message:"Unauthorised:Only owner of this restaurant can add tags  to this restaurant"})
        }
        const existingTagsSet=new Set(foundRestaurant.tags)
        tagarray.forEach(el=>existingTagsSet.delete(el))
        foundRestaurant.tags=Array.from(existingTagsSet)
        await foundRestaurant.save()
        return res.status(200).json({ message: "Tags removed successfully", data: foundRestaurant});

    }catch(err){
        return res.status(500).json({errorMessage:`err is ${err}`})
    }
}


module.exports={
    allRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    //menu related 
    addItemToMenu,
    editMenuItem,
    deleteMenuItem,
    increaseMenuItemQuanity,
    decreaseMenuItemQuanity,
    //offer related
    addOffer,
    removeOffer,
    //review related
    addReview,
    editReview,
    removeReview,
    //tag related
    addTag,
    removeTag
}