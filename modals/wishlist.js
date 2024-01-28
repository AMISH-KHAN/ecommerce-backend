const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:[true,"User Id Must Required!!!"],
    },
    productId:{
        type:String,
        required:[true,"Product Id Must Required!!!"],
    },
    name:{
        type:String,
        required:[true,"Name Must Required!!!"],
    },
    color:{
        type:String,
        required:[true,"Color Must Required!!!"],
    },
    size:{
        type:String,
        required:[true,"Size Must Required!!!"],
    },
    price:{
        type:Number,
        required:[true,"Price Must Required!!!"],
    },
    pic:{
        type:String,
        default:""
    }
})
const wishlist = new mongoose.model("wishlist",wishlistSchema)
module.exports = wishlist