const mongoose = require("mongoose")

const newsletterSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email Id Must Required!!!"],
        unique:true
    }
})
const newsletter = new mongoose.model("newsletter",newsletterSchema)
module.exports = newsletter