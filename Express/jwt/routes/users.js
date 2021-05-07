const express = require("express");
var multer = require('multer');
const path = require('path');
const User = require("../models/User");
const fs = require('fs');
const jwt = require('../controllers/jwt')

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
router.get("/:id",getUser, async (req, res) => {
    res.json(res.user);
}); 
// Create One Route
router.post("/signup", async (req, res) => {
    const user = new User({
       name: req.body.name,
       username : req.body.username,
       password : req.body.password,
       role : req.body.role
      });
      try {
        const newUser = await user.save();
        res.status(201).json({ newUser });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
});


router.post("/login", async (req, res) => {

  const {username,password} = req.body

    try {
      const user = await User.findOne({username,password});

      console.log(user)

      if(user)
      {

        const accessToken = jwt.generateAccessToken({username ,role : user.role})

        const refreshToken = jwt.generateRefreshToken({username ,role : user.role})

        refreshTokens.push(refreshToken)

        res.status(200).json({username,accessToken,refreshToken,id:user._id,role:user.role});
      }
      else
      {
        res.status(400).send('Incorrect username & password');
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

  res.send("Logout successful");
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