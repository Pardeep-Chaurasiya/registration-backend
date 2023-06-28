const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotenv = require("dotenv").config()

//instance of express app
const app=express();
const PORT=process.env.PORT;
app.use(cors());
app.use(bodyParser.json())
// app.use(express.json());
// app.use(express.urlencoded());//middleware->parse url-encoded data 
// in submitting in req. body

mongoose.set('strictQuery', true);
mongoose.connect(
    process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    },(err)=>{
        if(err) console.log("error in connecting db",err)
        console.log("MongoDb DB Connected Successfully");
    }
);
//Create Mongoose Schema for the User Model
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})


//create Mongoose model for User collection based on Schema
const User=new mongoose.model("User",userSchema);
app.get("/",(req,res)=>{
    res.send("Hello.Welcome to Registration and Login Backend");
})


//creat a route for Login based on User

app.post("/login",(req,res)=>{
    const {email,password}=req.body;

    User.findOne({email:email},(err,user)=>{
        if(user){
            if(password===user.password){
                res.send({message:"Login Successful",user:user})
            }else{
                res.send({message:"Password is not matched..."})
            }
        }else{
            res.send({message:"User is not Found."})
        }
    })
})

//Create a Route for Registration 
app.post('/register',(req,res)=>{
    const {name,email,password}=req.body;
    
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"User Already Registered"});
        }else{
                //create a new User instance object with 3 details
            const user=new User({
                name:name,
                email:email,
                password:password
            })

            user.save((err)=>{
                if(err){
                    res.send(err);
                }else{
                    res.send({message:"User Registered Successfully"});
                }
            })

        }
    })



})

app.listen(PORT,()=>{
    console.log("App Started on Port "+ PORT);
})