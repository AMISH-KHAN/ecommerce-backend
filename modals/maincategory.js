const mongoose = require("mongoose")

const maincategorySchema = new mongoose.Schema(
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

const maincategory = new mongoose.model("maincategory", maincategorySchema)
module.exports=maincategory