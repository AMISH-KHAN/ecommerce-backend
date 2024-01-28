const mongoose = require("mongoose")

async function getdatabase(){
    try {
        await mongoose.connect("mongodb://127.0.0.1/ecomerce2")
        console.log("database connected")
    }
    catch(error) {
        console.log(error)
    }
}
getdatabase()