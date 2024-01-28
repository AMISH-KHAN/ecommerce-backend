const express = require("express")
const multer =require("multer")
const user = require("../modals/user")
const fs=require("fs")
const bcrypt = require('bcrypt');
const [verifyToken, verifyTokenAdmin] = require("../verification")
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    requireTLS:true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "",
      pass: "",
    },
  });

var passwordValidator = require('password-validator');
var jwt = require('jsonwebtoken');



var schema = new passwordValidator();


schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase(1)                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
.has().symbols(1)    
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/users')
    },
    fieldSize:104857600,
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
  

const router = express.Router()//Router() is a method because it is a function {to provide routing on server side} inside express object

const upload = multer({ storage: storage })

//post request

router.post("/",async (req, res) => {
    var data = new user(req.body);
    if (schema.validate(req.body.password)) {
        
        bcrypt.hash(data.password, 12,async (err, hash)=>{
            if (err) {
        res.status(500).send({ result: "fail",message:"Internal server error" })
                
            }
            else {
                // hash not working yet
                data.password = hash
                try {
                    await data.save()
                    res.send({ result: "done",message:"record has been created",data:data})
                    
                }
                catch (error) {
                    if (error.keyValue) {
                        res.status(400).send({ result: "fail", message:"user name should be unique"})
                    }
                    else if (error.errors.name) {
                        res.status(400).send({ result: "fail", message:error.errors.name.message})
                        
                    }
                    else if (error.errors.username) {
                        res.status(400).send({ result: "fail", message:error.errors.username.message})
                        
                    }
                    else if (error.errors.password) {
                        res.status(400).send({ result: "fail", message:error.errors.password.message})
                        
                    }
                    else if (error.errors.email) {
                        res.status(400).send({ result: "fail", message:error.errors.email.message})
                        
                    }
                    else if (error.errors.phone) {
                        res.status(400).send({ result: "fail", message:error.errors.phone.message})
                        
                    }
                    else {
                    res.status(500).send({ result: "fail",message:"Internal server error" })
                        
                    }
                   
                }
            }
        })
       
    }
    else {
        res.status(400).send({ result: "fail", message:"invalid password must contain at least 8 digit, one uppercase one lower case, at least 2 digits with no space "})

    }
    
})

//get

router.get("/",verifyTokenAdmin ,async (req, res) => {
    try {
        var data =await user.find()
        res.send({result:"done",total:data.length,message:data})
        
    }
    catch {
        res.status(500).send({ result: "fail",message:"Internal server error" })
    }
})
router.get("/:_id", verifyToken,async (req, res) => {
    try {
        var data = await user.findOne({ _id: req.params._id })
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

router.put("/:_id",verifyToken, upload.single("pic"),async (req, res) => {
    try {
        var data = await user.findOne({ _id: req.params._id })
        if (data) {

            data.name = req.body.name ?? data.name
            data.username = req.body.username ?? data.username
            data.password = req.body.password ?? data.password
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.addressline1 = req.body.addressline1 ?? data.addressline1
            data.addressline2 = req.body.addressline2 ?? data.addressline2
            data.addressline3 = req.body.addressline3 ?? data.addressline3
            data.pin = req.body.pin ?? data.pin
            data.state = req.body.state ?? data.state
            data.role = req.body.role ?? data.role
            data.status = req.body.status ?? data.status
            // console.log(req.file.filename)
            try {
                if (req.file && data.pic) {
                    fs.unlinkSync(`public/users/${data.pic}`)
                }
            }
            catch (error) { }
            if (req.file) {

                data.pic= req.file.filename
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

router.delete("/:_id",verifyTokenAdmin, async (req, res) => {
    try {
       var data = await user.findOne({ _id: req.params._id })
        if (data) {
            if (data.pic) {
                try {
                    fs.unlinkSync(`public/users/${data.pic}`)
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

router.post("/login", async (req, res) => {
    try {
        
        var data = await user.findOne({ username: req.body.username })
        if (data) {
            const match = await bcrypt.compare(req.body.password, data.password)
            console.log(match)
            if (match) {
                if (data.role === "admin") {
                    
                    jwt.sign({ data },process.env.SAULTKEYADMIN , (error,token) => {
                        if (error) {
            res.status(500).send({ result: "fail",message:"Internal server error" })
                            
                        }
                        else {
                            res.send({result:"done",message:data,token:token})
                            
                        }
                    })
                }
                else if (data.role === "user") {
                    jwt.sign({ data },process.env.SAULTKEYUSER , (error,token) => {
                        if (error) {
            res.status(500).send({ result: "fail",message:"Internal server error" })
                            
                        }
                        else {
                            res.send({result:"done",message:data,token:token})
                            
                        }
                    })
                }
            }
            else {
                res.status(404).send({result:"fail",message:"invalid user"})
            }
        }
        else {
            res.status(404).send({result:"fail",message:"no user found"})
        }
    }
    catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" })
    }
})

router.post("/forgotpassword-1", async (req, res) => {
    try {
        var data = await user.findOne({ username: req.body.username })
        if (data) {
            var num = parseInt(Math.random() * 10000000)
            data.otp = num
            await data.save()
            let mailoption = {
                from: "khanamish8923@gmail.com",
                to: data.email,
                subject:"Do not share OTP for password reset",
        text : `your otp ${num}\n team eshopper\n`
            }
            transporter.sendMail(mailoption, (error, data) =>{
                if (error) {
                    console.log(error)
                }
            })
            res.send({result:"done",message:"otpsend to your email"})
        }
        else{
            res.status(401).send({result:"fail",message:"invalid user"})

        }
    }
    catch(error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" })
        
    }
})

router.post("/forgotpassword-2", async (req, res) => {
    try {
        var data = await user.findOne({ username: req.body.username })
        if (data) {
            if (data.otp === req.body.otp) {
                res.send({result:"done",message:"done"})
                
            }
            else {
                res.status(401).send({result:"done",message:"invalid otp"})
            }
        }
        else{
            res.status(401).send({result:"fail",message:"invalid user"})
        }
    }
    catch(error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" })
        
    }
})

router.post("/forgotpassword-3", async (req, res) => {
    try {
        var data = await user.findOne({ username: req.body.username })
        if (data) {
            if (schema.validate(req.body.password)) {
        
                bcrypt.hash(data.password, 12,async (err, hash)=>{
                    if (err) {
                res.status(500).send({ result: "fail",message:"Internal server error" })
                        
                    }
                    else {
                        data.password = hash
                        try {
                            await data.save()
                            res.send({ result: "done",message:"record has been created",data:data})
                            
                        }
                        catch (error) {
                            
                            res.status(500).send({ result: "fail",message:"Internal server error" })
                                
                            
                           
                        }
                    }
                })
               
            }
            else {
                res.status(400).send({ result: "fail", message:"invalid password must contain at least 8 digit, one uppercase one lower case, at least 2 digits with no space "})
        
            }
        }
        else{
            res.status(401).send({result:"fail",message:"invalid user"})
        }
    }
    catch(error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" })
        
    }
})

module.exports=router