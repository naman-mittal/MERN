const express = require("express");
var multer = require('multer');
const path = require('path');
const User = require("../models/User");
const Token = require("../models/Token")
const fs = require('fs');
const jwt = require('../controllers/jwt')
var crypto = require('crypto');
var nodemailer = require('nodemailer');

const router = express.Router();

var refreshTokens = []


async function getUser(req, res, next) {
    let user;
    try {
      user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: "Cannot find User" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
  }


// Get All Route
router.get("/",jwt.authenticateToken, async (req, res) => {
    try {

      if(req.user.role==='admin')
      {
        const users = await User.find()
        res.json(users)
      }
      else
      {
        res.status(403).json({message: 'Not Authorized'})
      }

        
      } catch (err) {
        res.status(500).json({message: err.message})
      }
}); 
// Get One Route
router.get("/:id",jwt.authenticateToken,getUser, async (req, res) => {
    res.json(res.user);
}); 
// Create One Route
router.post("/signup", async (req, res) => {
    // const user = new User({
    //    name: req.body.name,
    //    email : req.body.email,
    //    username : req.body.username,
    //    password : req.body.password,
    //    role : req.body.role
    //   });
      try {

        var user = await User.findOne({email : req.body.email})

        console.log("user found : ",user)

        if(user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' })

        user = await User.findOne({username : req.body.username})

        if(user) return res.status(400).send({ msg: 'The username you have entered is already associated with another account.' })

        user = new User({
          name: req.body.name,
          email : req.body.email,
          username : req.body.username,
          password : req.body.password,
          role : req.body.role
         });

        const newUser = await user.save();


        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') })

        token = await token.save()

        var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
        var mailOptions = { from: 'naman.mittal_cs17@gla.ac.in', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/' + token.token  };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
        });

       // res.status(201).json({ newUser });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
});

router.get("/confirmation/:token",async(req,res) => {

  try{

    const token = await Token.findOne({token : req.params.token})

    if(!token) return res.status(400).send({ msg: 'We were unable to find a valid token. Your token my have expired.' })

    const user = await User.findOne({_id : token._userId})

    if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
    if (user.isVerified) return res.status(400).send({ msg: 'This user has already been verified.' });

    user.isVerified = true

    const updatedUser = await user.save()

    res.status(200).send("The account has been verified. Please log in.");

  }
  catch(err){

    res.status(400).json({ msg: err.message });

  }

})

router.post("/resend", async(req,res)=>{

  try{
   
    const user =await User.findOne({email : req.body.email})

    if(!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' })

    if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' })

    console.log("resend user : ",user)
    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') })

        token = await token.save()

        var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
        var mailOptions = { from: 'naman.mittal_cs17@gla.ac.in', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/' + token.token  };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
        });

  }
  catch(err){
    res.status(400).json({ msg: err.message });
  }


})
router.post("/login", async (req, res) => {

  const {username,password} = req.body

    try {
      const user = await User.findOne({username});

      console.log(user)

      if(user)
      {

        if(user.password===password)
        {
          if(user.isVerified)
          {
            const accessToken = jwt.generateAccessToken({username ,role : user.role})

        const refreshToken = jwt.generateRefreshToken({username ,role : user.role})

        refreshTokens.push(refreshToken)

        res.status(200).json({username,accessToken,refreshToken,id:user._id,role:user.role});
          }
          else
          {
             res.status(401).json({msg: 'Your account has not been verified.' })
          }
          
        }
        else
        {
          res.status(401).json({msg : "Invalid email or password!"})
        }

        
      }
      else
      {
        res.status(401).json({msg : `username : ${username} is not associated with any account. Check your username!`})
      }

     
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});


router.post("/upload/:id",getUser, async (req, res) => {

  const id = req.params.id

  let filename = ""

  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/Uploads/Images");
    },
    filename: function(req, file, callback) {
      filename = id+Date.now()+'.'+ file.originalname.split(".")[1]
        callback(null, filename);
    }
  });

  var upload = multer({
    storage: storage
  }).single('image')

  upload(req, res, async(err) => {
    if (err) {
      console.log(err)
        return res.end("Something went wrong!");
    }

    let user = res.user

    const filepath = res.user.image

    var path = ""

    if(filepath)
    {
       path = './public/uploads/images/' + filepath.substring(filepath.lastIndexOf('/')+1)
    }

    

    
      fs.unlink(path, (err) => {
        if (err) {
          console.error("First time upload error")
         
        }
      })
    
    


    res.user.image= `http://localhost:4000/static/uploads/images/${filename}`
    
    try {
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
    // return res.end("File uploaded sucessfully!.");
});




});


router.post('/token', async(req, res) => {
  const { token } = req.body;

  if (!token) {
     return  res.status(401).send("No token sent");
  }

  if (!refreshTokens.includes(token)) {
     return  res.status(403).send("refresh token does not exist");
  }

  

      const accessToken = jwt.authenticateRefreshToken(res,token)

     

      

});

router.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);

  res.json({message : 'Logout successfull'})
});

// Edit One Route PUT version
router.put("/:id", async (req, res) => {
// Rest of the code will go here
});
// Edit One Route PATCH version
router.patch("/:id", async (req, res) => {
// Rest of the code will go here
});
// Delete One Route
router.delete("/:id", async (req, res) => {
// Rest of the code will go here
});
module.exports = router;