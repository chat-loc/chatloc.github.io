const express = require("express");
const exphbs  = require('express-handlebars');

// Add body parser to process form data 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//This loads all our environment variables from the keys.env
require("dotenv").config({path:'./config/keys.env'});

// Import router objects
const userRoutes = require("./controllers/User"

const user = require("./models/user");

// Creation of app object
const app = express();

// BodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));

//express static middleware
app.use(express.static("public"));

//Handlebars middlware
app.engine("handlebars", exphbs({
    extname : '.handlebars',
    helpers : require('./config/handlebars-helpers')
}));

app.set("view engine", "handlebars");

// Handle PUT and DELETE requests
app.use((req, res, next) => {
    if (req.query.method == "PUT") {
        req.method = "PUT"
    } else if (req.query.method == "DELETE") {
        req.method = "DELETE"
    }
    next();
});

// User Routes
app.use("/user", userRoutes);


app.get('/', (req, res) => {
    res.render("registration.html", {
        title : "Registration Page"
    });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});