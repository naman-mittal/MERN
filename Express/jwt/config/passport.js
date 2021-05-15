const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv');
const User = require('../models/User')


// get config vars
dotenv.config();

passport.use(new Strategy({
    clientID: process.env.FACEBOOK_APP_KEY,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/users/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  async function(accessToken, refreshToken, profile, cb) {

    // console.log("in here")
    // console.log(profile)
    // console.log(cb)


    var user = await User.findOne({email : profile._json.email})

    if(!user)
    {

      
    user = new User({
      username : profile._json.id,
      email : profile._json.email,
      name : profile._json.name,
      role : "user"
    })

    const newUser = await user.save()

    }


    

    // save the profile on the Database
    // Save the accessToken and refreshToken if you need to call facebook apis later on
    return cb(null, profile);
  }));
  
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  module.exports = passport