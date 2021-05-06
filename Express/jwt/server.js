const jwt = require("../controllers/jwt");
const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const routes = require('./routes/index')
const db = require('./config/db')

const app = express();

MongoClient.connect(db.url, { useUnifiedTopology: true })
  .then((client) => {

    console.log("Connected to Database");

    app.use(bodyParser.json());

    routes(app,client.db())

    app.listen(db.port, () => console.log("listening on port : ",db.port));

  })
  .catch((error) => console.error(error));
