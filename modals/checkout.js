const mongoose = require("mongoose")

const checkoutSchema = new mongoose.Schema({
    userId: {
        type: String,
        required:[true,"User id must required!!"]
    },
    paymentMode: {
        type: String,
        default:"COD"
    },
    paymentStatus: {
        type: String,
        default:"pending"
    },
    orderStatus: {
        type: String,
        default:"order is placed"
    },
    rrpid: {
        type: String,
        default:""
    },
    date: {
        type: String,
        
    },
    totalAmount: {
        type: String,
        
    },
    shippingAmount: {
        type: String,
        
    },
    finalAmount: {
        type: String,
        
    },
    products:[
        {
            productId:{
                type:String,
            
            },
            name:{
                type:String,

            },
            color:{
                type:String,
    
            },
            size:{
                type:String,

            },
            price:{
                type:Number,
    
            },
            qty:{
                type:Number,
                
            },
            total:{
                type:Number,
            },
            pic:{
                type:String,
            }
        }
    ]
})

const checkout = new mongoose.model("checkout", checkoutSchema)
module.exports=checkout