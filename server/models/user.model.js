const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phoneNumber: {
        type: String,
        required:true,
        
         length: 10,
        validate: {
            validator: function(value) {
                // Custom validation: Check if there are no spaces in the phoneNumber
                return !/\s/.test(value);
            },
            message: 'Phone number should not contain spaces',
        }}, 
    email: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness
        trim: true, // Remove leading/trailing whitespaces
        lowercase: true, // Convert to lowercase
        validate: {
            validator: function (value) {
                // Using a basic regex for email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email format"
        }
    },
    password:{
        type:String,
        required:true
    },
    addresses:{
        type:[{
            adressType:{
                type:String,
                default:"Home"
            },
            city:{
                type:String,
                default:"Puri" 
            },
            state:{
                type:String,
                default:"Orissa" 
            },
            street:{
                type:String,
                required:true,
            }
        }],
        default:[]
    },
    orders:{
        type:[
            {
                restaurantName:{
                    type:String,
                required:true
                },
                addressDetails:{
                    addressType:String,
                    state:String,
                    city:String,
                    street:String
                },
                amount:{
                    type:Number,
                    required:true
                    
                },
                orderDate:{
                    type:Date,
                    default:Date.now
                }
                
            }
        ],
        default:[] 
    },
    savedPaymentMethords:{
        type:[],
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    restaurantOwner:{
        type:Boolean,
        default:false
    },
    favourates:{
        type:[],
        default:[],

    }

})
const UserForFoodDeliveryApp=new mongoose.model("UserForFoodDeliveryApp",userSchema)
module.exports=UserForFoodDeliveryApp;