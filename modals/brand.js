const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
            unique:true
        },
        status: {
            type: String,
            default:"Active"
        }
    }
)

const brand = new mongoose.model("brand", brandSchema)
module.exports=brand