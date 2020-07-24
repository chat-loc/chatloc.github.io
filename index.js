const express = require("express");
const exphbs  = require('express-handlebars');

// Creation of app object
const app = express();

// Set up socket
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

// Add body parser to process form data 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//This loads all our environment variables from the key.env
require("dotenv").config({path:'./config/key.env'});


//Handlebars middlware
app.engine("handlebars", exphbs({
    extname : '.handlebars',
    helpers : require('./config/handlebars-helpers')
}));

// Import router objects
const userRoutes = require("./controllers/User");
const generalRoutes = require("./controllers/General");


// BodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));

//express static middleware
app.use(express.static("public"));


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
app.use("/", generalRoutes);
app.use("/user", userRoutes);

/*app.get('/', (req, res) => {
    res.render("registration", {
        title : "Registration Page"
    });
});*/


// Pass in the connection string variable from the env variable as 1st argument
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}
                    ).then(()=> {
                        console.log(`Connected to MongoDB Database`);
                    }).catch(()=> {
                        console.log (`Error occured when connecting to the database ${err}`);
                    });
const PORT = process.env.PORT || 5003;

/*app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});*/

server.listen(PORT, ()=> {
     console.log(`Server is listening on port: ${PORT}`);
});

const tech = io.of('/tech');
const users = {};

tech.on('connection', function (socket) {
    
    // 1a. Listen for user about to join a room (called on load in client-side)
    socket.on('join', (data) => {

        socket.join(data.room); //  1b. Identify the appropriate room to work with from data passed in client

        /*1c. Save current user name on 'join' event. This will be used later to compare if its same 
        user on form 'submit' event.*/
        users[socket.id] = data.name; 

        console.log(users);
        users['room'] = data.room;

        // Broadcast message (Load chats when user first joins room)

    });

});
