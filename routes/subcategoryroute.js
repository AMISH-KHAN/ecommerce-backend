const express = require("express")
const [verifyToken,verifyTokenAdmin]=require("../verification")
const subcategory = require("../modals/subcategory")



const router = express.Router()//Router() is a method because it is a function {to provide routing on server side} inside express object 

//post request

router.post("/",verifyTokenAdmin,async (req, res) => {
    try {
        var data = new subcategory(req.body);
        await data.save()
        res.send({ result: "done",message:"record has been created",data:data})
    }
    catch (error) {
        
        if (error.keyValue) {
            res.status(400).send({ result: "fail", message:"name should be unique"})
        }
        else if (error.errors) {

            console.log(error.errors)
            res.status(400).send({ result: "fail", message:error.errors.name.message})
            
        }
        else {
            res.status(500).send({ result: "fail",message:"Internal server error" })
        }
    }
})

//get

router.get("/", async (req, res) => {
    try {
        var data =await subcategory.find()
        res.send({result:"done",total:data.length,message:data})
        
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})
router.get("/:_id", async (req, res) => {
    try {
        var data = await subcategory.findOne({ _id: req.params._id })
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

router.put("/:_id",verifyTokenAdmin, async (req, res) => {
    try {
        var data = await subcategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            console.log(data.name)
            data.status = req.body.status ?? data.status
            await data.save()
            res.send({result:"done",message:"Record is updated!!!"})
        }
        else {
            res.status(404).send({result:"failed",message:"no record found"})
        }
        
    }
    catch (error) {
        console.log(error.errors.name)
        if (error.keyValue) {
            res.status(400).send({ result: "fail", message:"name should be unique"})
        }
        else if (error.errors) {

            console.log(error.errors)
            res.status(400).send({ result: "fail", message:error.errors.name.message})
            
        }
        else {
            res.status(500).send({ result: "fail",message:"Internal server error" })
        }
    }
})

router.delete("/:_id", verifyTokenAdmin,async (req, res) => {
    try {
       await subcategory.deleteOne({ _id: req.params._id })
       res.send({result:"done",message:"Record is deleted"})
        
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})

module.exports=router