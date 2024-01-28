const express = require("express")
const multer =require("multer")
const product = require("../modals/product")
const fs=require("fs")
const [verifyToken,verifyTokenAdmin]=require("../verification")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/products')
    },
    fieldSize:104857600,
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
  

const router = express.Router()//Router() is a method because it is a function {to provide routing on server side} inside express object

const upload = multer({ storage: storage })

//post request

router.post("/",verifyTokenAdmin ,upload.fields([
    {name:"pic1",maxcounts:1},
    {name:"pic2",maxcounts:1},
    {name:"pic3",maxcounts:1},
    {name:"pic4",maxcounts:1}
]),async (req, res) => {
    try {
        var data = new product(req.body);
        data.finalprice = Math.round(parseInt(data.baseprice) - parseInt(data.baseprice)*parseInt(data.discount)/100)
        if (req.files.pic1) {
            data.pic1=req.files.pic1[0].filename
        }
        if (req.files.pic2) {
            data.pic2=req.files.pic2[0].filename
        }
        if (req.files.pic3) {
            data.pic3=req.files.pic3[0].filename
        }
        if (req.files.pic4) {
            data.pic4=req.files.pic4[0].filename
        }
        await data.save()
        res.send({ result: "done",message:"record has been created",data:data})
    }
    catch (error) {
        if (error.errors.name) {
            res.status(400).send({ result: "fail", message:error.errors.name.message})
            
        }
        else if (error.errors.maincategory) {
            res.status(400).send({ result: "fail", message:error.errors.maincategory.message})
            
        }
        else if (error.errors.subcategory) {
            res.status(400).send({ result: "fail", message:error.errors.subcategory.message})
            
        }
        else if (error.errors.product) {
            res.status(400).send({ result: "fail", message:error.errors.product.message})
            
        }
        else if (error.errors.size) {
            res.status(400).send({ result: "fail", message:error.errors.size.message})
            
        }
        else if (error.errors.color) {
            res.status(400).send({ result: "fail", message:error.errors.color.message})
            
        }
        else if (error.errors.baseprice) {
            res.status(400).send({ result: "fail", message:error.errors.baseprice.message})
            
        }
        else {
            res.status(500).send({ result: "fail",message:"Internal server error" })
        }
    }
})

//get

router.get("/", async (req, res) => {
    try {
        var data =await product.find()
        res.send({result:"done",total:data.length,message:data})
        
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})
router.get("/:_id", async (req, res) => {
    try {
        var data = await product.findOne({ _id: req.params._id })
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

router.put("/:_id",verifyTokenAdmin ,upload.fields([
    {name:"pic1",maxcounts:1},
    {name:"pic2",maxcounts:1},
    {name:"pic3",maxcounts:1},
    {name:"pic4",maxcounts:1}
]),async (req, res) => {
    try {
        var data = await product.findOne({ _id: req.params._id })
        if (data) {

            data.name = req.body.name ?? data.name
            data.maincategory = req.body.maincategory ?? data.maincategory
            data.subcategory = req.body.subcategory ?? data.subcategory
            data.brand = req.body.brand ?? data.brand
            data.size = req.body.size ?? data.size
            data.color = req.body.color ?? data.color
            data.baseprice = req.body.baseprice ?? data.baseprice
            data.discount = req.body.discount ?? data.discount
        data.finalprice = Math.round(parseInt(data.baseprice) - parseInt(data.baseprice)*parseInt(data.discount)/100)

            data.stock = req.body.stock ?? data.stock
            data.description = req.body.description ?? data.description
            data.status = req.body.status ?? data.status
            try {
                if (req.files.pic1 && data.pic1) {
                    fs.unlinkSync(`public/products/${data.pic1}`)
                }
            }
            catch (error) { }
            if (req.files.pic1) {

                data.pic1= req.files.pic1[0].filename
            }
            try {
                if (req.files.pic2 && data.pic2) {
                    // console.log(req.files)
                    fs.unlinkSync(`public/products/${data.pic2}`)
                }
            }
            catch (error) { }
            if (req.files.pic2) {
                data.pic2= req.files.pic2[0].filename
            }
            try {
                if (req.files.pic3 && data.pic3) {
                    fs.unlinkSync(`public/products/${data.pic3}`)
                }
            }
            catch (error) { }
            if (req.files.pic3) {
                data.pic3= req.files.pic3[0].filename
            }
            try {
                if (req.files.pic4 && data.pic4) {
                    fs.unlinkSync(`public/products/${data.pic4}`)
                }
            }
            catch (error) { }
            if (req.files.pic4) {
                data.pic4= req.files.pic4[0].filename
            }
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
        else if (error.errors) {
            res.status(400).send({ result: "fail", message:error.errors.name.message})
            
        }
        else {
            res.status(500).send({ result: "fail",message:"Internal server error" })
        }
    }
})

router.delete("/:_id",verifyTokenAdmin ,async (req, res) => {
    try {
       var data = await product.findOne({ _id: req.params._id })
        if (data) {
            if (data.pic1) {
                try {
                    fs.unlinkSync(`public/products/${data.pic1}`)
                }
                catch(error){}
            }
            if (data.pic2) {
                try {
                    fs.unlinkSync(`public/products/${data.pic2}`)
                }
                catch(error){}
            }
            if (data.pic3) {
                try {
                    fs.unlinkSync(`public/products/${data.pic3}`)
                }
                catch(error){}
            }
            if (data.pic4) {
                try {
                    fs.unlinkSync(`public/products/${data.pic4}`)
                }
                catch(error){}
            }
            data.deleteOne()
            res.send({result:"done",message:"Record is deleted"})
        }
        else {
            res.status(404).send({result:"failed",message:"no record found"})
        }
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})

router.post("/search", async (req, res) => {
    try
    {
        var data = await product.find({
        $or:[
            {name:{$regex:`.*${req.body.search}.*`,$options:'i'}},
            {maincategory:{$regex:`.*${req.body.search}.*`,$options:'i'}},
            {subcategory:{$regex:`.*${req.body.search}.*`,$options:'i'}},
            {brand:{$regex:`.*${req.body.search}.*`,$options:'i'}},
            {color:{$regex:`.*${req.body.search}.*`,$options:'i'}},
            {size:{$regex:`.*${req.body.search}.*`,$options:'i'}},
            {stock:{$regex:`.*${req.body.search}.*`,$options:'i'}},
            {description:{$regex:`.*${req.body.search}.*`,$options:'i'}}
        ]
        })
        res.send({result:"done",count:data.length,data:data})
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ result: "fail",message:"Internal server errorrrr" })

    }
})


module.exports=router