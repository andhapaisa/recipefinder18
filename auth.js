const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
mongoose.connect("mongodb://localhost:27017/auth",{ useUnifiedTopology: true });

const userschema=new mongoose.Schema({
  myname:String,
  email:String,
  password:String
});

const User = mongoose.model("User",userschema);

app.get("/",(req,res)=>{
  res.redirect("/login");
});

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
  const alertMessage = req.session.alertMessage;
  req.session.alertMessage = null;

  res.render('signup', { alertMessage });
});
let fname ="";
app.get("/Home",(req,res)=>{
  const alertMessage = req.session.alertMessage;
  req.session.alertMessage = null;
  const fname = req.session.fname;
  req.session.fname = null;
  res.render('Home', { alertMessage ,fname});
})
app.post("/register",async (req,res)=>{
 let name=req.body.fullname;
  const newUser={
    myname:name,
   email:req.body.username,
 password :req.body.password
  };
  let data = await User.create(newUser);
  if(data){

    const alertMessage = 'Signup successful! Welcome to our website.';
    req.session.alertMessage = alertMessage;
  
    res.redirect('/Home');
  }
  else{
    const alertMessage = "Munna something is wrong try again";
          
    res.render('login',{alertMessage:alertMessage});
  }
  });

  app.post("/login", async (req,res)=>{
    let em = req.body.username;
     let pass = req.body.password;
   const data = await User.findOne({email:em});
     
        if(data){
          if(data.password===pass){
            const alertMessage = 'Login successful! Welcome to our website.';
            fname=data.myname;
            req.session.alertMessage = alertMessage;
            req.session.fname = fname;
            res.redirect('/Home');
          }
          else{
            const alertMessage = 'Munna Wrong Password';
          
            res.render('login',{alertMessage:alertMessage});
          }
        }
        else{
          const alertMessage = 'You are a new user, signup please';
          req.session.alertMessage = alertMessage;
        
          res.redirect('/register');
        }
       });
    
       app.post("/Home",(req,res)=>{
        const fname = req.session.fname;
        req.session.fname = null;
        res.render('Home', {fname});
        
       })

       app.post("/Contact",(req,res)=>{
        const fname = req.session.fname;
  req.session.fname = null;
        res.render("contactus",{fname});
       })

       app.post("/About",(req,res)=>{
        const fname = req.session.fname;
  req.session.fname = null;
        res.render("aboutus",{fname});
       })

       app.post("/recipes",(req,res)=>{
        const fname = req.session.fname;
  req.session.fname = null;
        res.render("recipes",{fname});
       })

   app.post("/logout",(req,res)=>{
    res.redirect("/");
   });
  
app.listen(2000);