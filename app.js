require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption'); //Level 2 (Encrption)
// const md5 = require('md5');//Level 3 (Hashing)
const bcrypt = require('bcrypt');
const saltRounds =10;
const app =express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchema =new mongoose.Schema({
    email:String,
    password:String
});

//Level 2 (Encrption)
// userSchema.plugin(encrypt,{secret: process.env.MY_SECRET , encryptedFields:["password"]});  //data encryption have to happen before creating  model
 
const User = mongoose.model("user",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then(function(foundUser,err){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("Secrets"); 
                    }
                });
            }
        }
    })
})

app.post("/register" , function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email:req.body.username,
            password:hash
         });
          
         newUser.save().then(function(item,err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
         }); 
    });
 });
    
   

app.listen(3000,function(){
    console.log("Server Successfully started on port 3000");
})