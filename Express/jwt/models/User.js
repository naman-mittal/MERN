const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
name: {
  type: String,
  required: true
 },
 email : {
   type : String,
   required : true,
   unique : true
 },
 username : {
   type : String,
   unique : true
 },
 password : {
  type : String,
},
isVerified: { 
  type: Boolean, 
  default: false 
},
role : {
  type : String,
  required : true
},
image: {
  type: String,
  required: false
 }
});
const User = mongoose.model("User", userSchema);
module.exports = User;