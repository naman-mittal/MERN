const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
name: {
  type: String,
  required: true
 },
 username : {
   type : String,
   required : true,
   unique : true
 },
 password : {
  type : String,
  required : true,
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