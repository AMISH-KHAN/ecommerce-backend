const express = require("express")
const [verifyToken,verifyTokenAdmin]=require("../verification")
const checkout=require("../modals/checkout")
const router = express.Router()

router.post("/",verifyToken ,async (req, res) => {
    try {
        var data = new checkout(req.body)
        await data.save()
        res.send({result:"done",total:data.length,message:data})
    }
    catch (error) {
        if (error.errors.userId) {
            res.status(400).send({result:"fail",message:error.errors.userId.message})
        }
        else {
            res.status(500).send({result:"fail",message:"internal server error"})
            
        }
    }
})

router.get("/", verifyTokenAdmin,async (req, res)=>{
    try {
        var data = await checkout.find().sort({_id:-1})
        res.send({result:"done",total:data.length,message:data})
    }
    catch (error) {
        res.status(500).send({result:"fail",message:"internal server error"})
        
    }
})
router.get("/user/:userId", verifyToken,async (req, res)=>{
    try {
        var data = await checkout.find({userId:req.params.userId}).sort({_id:-1})
        res.send({result:"done",total:data.length,message:data})
    }
    catch (error) {
        res.status(500).send({result:"fail",message:"internal server error"})
        
    }
})
router.get("/:_id", verifyTokenAdmin,async (req, res)=>{
    try {
        var data = await checkout.find({ _id: req.params._id }).sort({ _id: -1 })
        if(data)
        res.send({result:"done",total:data.length,message:data})
        else
            res.status(404).send({result:"fail",message:"no such record found"})
    }
    catch (error) {
        res.status(500).send({result:"fail",message:"internal server error"})
        
    }
})
router.put("/:_id", verifyTokenAdmin,async (req, res) => {
    try {
        var data =await checkout.findOne({ _id: req.params._id })
        if (data) {
            data.paymentMode=req.body.paymentMode??data.paymentMode
            data.paymentStatus=req.body.paymentStatus??data.paymentStatus
            data.orderStatus=req.body.orderStatus??data.orderStatus
            data.rppid = req.body.rppid ?? data.rppid
            await data.save()
            res.send({result:"done",message:"record updated successfully"})
            
        }
        else {
            res.status(404).send({result:"fail",message:"no such record found"})
            
        }
    }
    catch (error) {
        console.log(error)
        if(error.keyValue)
        res.status(400).send({result:"Fail",message:"Name Must Be Unique"})
        else
        res.status(500).send({result:"Fail",message:"Internal Server Error"})
    }
})

module.exports=router