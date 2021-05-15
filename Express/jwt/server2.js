// const jwt = require("../controllers/jwt");
const express = require("express");
var cors = require('cors')
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const routes = require('./routes/index')
const mongoose = require('mongoose')
const passport = require('./config/passport')

const app = express();



var publicDir = require('path').join(__dirname,'/public'); 

console.log(publicDir)

// MongoClient.connect(db.url, { useUnifiedTopology: true })
//   .then((client) => {

//     console.log("Connected to Database");

//     app.use(bodyParser.json());

//     routes(app,client.db())

//     app.listen(db.port, () => console.log("listening on port : ",db.port));

//   })
//   .catch((error) => console.error(error));

try{
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }); 
}
catch(err)
{
    console.log(err.message)
}
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("connection to db established"));
app.use(express.json());
// app.use(express.static('public'));

app.use('/static', express.static('public'))
app.use(passport.initialize());
app.use(passport.session());

app.use(cors())
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);
app.listen(4000, () => console.log(`server has started at port ${4000}`));
