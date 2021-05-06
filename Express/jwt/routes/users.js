const express = require("express");
var multer = require('multer');
const path = require('path');
const router = express.Router();
const User = require("../models/User");
const fs = require('fs');





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
router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
      } catch (err) {
        res.status(500).json({message: err.message})
      }
}); 
// Get One Route
router.get("/:id",getUser, async (req, res) => {
    res.json(res.user);
}); 
// Create One Route
router.post("/", async (req, res) => {
    const user = new User({
       name: req.body.name,
      });
      try {
        const newUser = await user.save();
        res.status(201).json({ newUser });
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

    const path = './public/uploads/images/' + filepath.substring(filepath.lastIndexOf('/')+1)

fs.unlink(path, (err) => {
  if (err) {
    console.error(err)
   
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