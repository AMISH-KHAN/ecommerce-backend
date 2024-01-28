const express = require("express")
const multer =require("multer")
const wishlist = require("../modals/wishlist")
const [verifyToken,verifyTokenAdmin]=require("../verification")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/wishlists')
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
        var data = new wishlist(req.body);
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
        else {
            res.status(500).send({ result: "fail",message:"Internal server error" })
        }
    }
})

//get

router.get("/:userId", verifyToken,async (req, res) => {
    try {
        var data =await wishlist.find({userId:req.params.userId}).sort({_id:-1})
        res.send({result:"done",total:data.length,message:data})
        
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})




router.delete("/:_id", verifyToken,async (req, res) => {
    try {
        await wishlist.deleteOne({ _id: req.params._id })
        res.send({result:"done",message:"record deleted!!"})
          
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})

module.exports=router