const express = require("express")
const multer =require("multer")
const cart = require("../modals/cart")
const [verifyToken,verifyTokenAdmin]=require("../verification")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/carts')
    },
    fieldSize:104857600,
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
  

const router = express.Router()//Router() is a method because it is a function {to provide routing on server side} inside express object

// const upload = multer({ storage: storage })

//post request

router.post("/",verifyToken,async (req, res) => {
    try {
        var data = new cart(req.body);
        data.total=data.price*data.qty
        await data.save()
        res.send({ result: "done",message:"record has been created",data:data})
    }
    catch (error) {
        if (error.errors.userId) {
            res.status(400).send({ result: "fail", message:error.errors.userId.message})
            
        }
        else if (error.errors.productId) {
            res.status(400).send({ result: "fail", message:error.errors.productId.message})
            
        }
        else if (error.errors.name) {
            res.status(400).send({ result: "fail", message:error.errors.name.message})
            
        }
        else if (error.errors.color) {
            res.status(400).send({ result: "fail", message:error.errors.color.message})
            
        }
        else if (error.errors.size) {
            res.status(400).send({ result: "fail", message:error.errors.size.message})
            
        }
        else if (error.errors.price) {
            res.status(400).send({ result: "fail", message:error.errors.price.message})
            
        }
        else if (error.errors.total) {
            res.status(400).send({ result: "fail", message:error.errors.total.message})
            
        }
        else {
            res.status(500).send({ result: "fail",message:"Internal server error" })
        }
    }
})

//get

router.get("/user/:userId", verifyToken,async (req, res) => {
    try {
        var data =await cart.find({userId:req.params.userId}).sort({_id:-1})
        res.send({result:"done",total:data.length,message:data})
        
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})
router.get("/:_id",verifyToken ,async (req, res) => {
    try {
        var data = await cart.findOne({ _id: req.params._id })
        if (data) {
            res.send({result:"done",message:data})
        }
        else {
            res.status(404).send({result:"failed",message:"no record found"})
        }
        
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})

// put request

router.put("/:_id", verifyToken,async (req, res) => {
    try {
        var data = await cart.findOne({ _id: req.params._id })
        if (data) {

            data.qty = req.body.qty ?? data.qty
            data.total = req.body.total ?? data.total
            await data.save()
            res.send({result:"done",message:"Record is updated!!!"})
        }
        else {
            res.status(404).send({result:"failed",message:"no record found"})
        }
        
    }
    catch (error) {
        console.log(error)
        if (error.keyValue) {
            res.status(400).send({ result: "fail", message:"name should be unique"})
        }
        else {
            res.status(500).send({ result: "fail",message:"Internal server error" })
        }
    }
})

router.delete("/:_id", async (req, res) => {
    try {
        await cart.deleteOne({ _id: req.params._id })
        res.send({result:"done",message:"record deleted!!"})
          
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})

module.exports=router