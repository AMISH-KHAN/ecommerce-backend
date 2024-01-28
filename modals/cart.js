const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
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
    qty:{
        type:Number,
        required:[true,"Quantity Must Required!!!"],
    },
    total:{
        type:Number,
    },
    pic:{
        type:String,
        default:""
    }
})
const cart = new mongoose.model("cart",cartSchema)
module.exports = cart