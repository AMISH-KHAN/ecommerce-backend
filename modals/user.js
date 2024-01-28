const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    new mongoose.Schema({
        name:{
            type:String,
            required:[true,"name Must Required!!!"]
        },
        username:{
            type:String,
            required: [true, "user name Must Required!!!"],
            unique:true
        },
        password:{
            type:String,
            required:[true,"password Must Required!!!"]
        },
        email:{
            type:String,
            required:[true,"email Must Required!!!"]
        },
        phone:{
            type:String,
            required:[true,"phone Must Required!!!"]
        },
        addressline1:{
            type: String,
            default:""
        },
        addressline2:{
            type:String,
            default: ""
        },
        addressline3:{
            type:String,
            default:""
        },
        pin:{
            type:String,
            default:""
        },
        city:{
            type:String,
            default:""
        },
        state:{
            type:String,
            default:""
        },
        pic:{
            type:String,
            default:""
        },
        role:{
            type:String,
            default:"user"
        },
        otp: {
            type: Number,
            default:-123
        },
        status:{
            type:String,
            default:"Active"
        }
    })
)

const user = new mongoose.model("user", userSchema)
module.exports=user