const express = require("express")
const dotenv=require("dotenv")

const maincategoryroute=require("./routes/maincategoryroute")
const subcategoryroute=require("./routes/subcategoryroute")
const brandroute=require("./routes/brandroute")
const productroute=require("./routes/productroute")
const userroute=require("./routes/userroute")
const cartroute=require("./routes/cartroute")
const wishlistroute=require("./routes/wishlistroute")
const checkoutroute=require("./routes/checkoutroute")
const newsletterroute=require("./routes/newsletterroute")
const contactroute=require("./routes/contactroute")



require("./dbconnect")


const app = express()

dotenv.config()

app.use(express.json())
app.use("/public",express.static("public"))


app.use("/api/maincategory",maincategoryroute)
app.use("/api/subcategory",subcategoryroute)
app.use("/api/brand",brandroute)
app.use("/api/product",productroute)
app.use("/api/user",userroute)
app.use("/api/cart",cartroute)
app.use("/api/wishlist",wishlistroute)
app.use("/api/checkout",checkoutroute)
app.use("/api/newsletter",newsletterroute)
app.use("/api/contact",contactroute)

app.listen((8000), () => {
    console.log("http://localhost:8000")
})