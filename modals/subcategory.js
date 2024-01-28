const mongoose = require("mongoose")

const subcategorySchema = new mongoose.Schema(
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

const subcategory = new mongoose.model("subcategory", subcategorySchema)
module.exports=subcategory