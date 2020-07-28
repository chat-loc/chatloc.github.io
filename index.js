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
const Schema = mongoose.Schema;

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


// DATABASE HANDLERS

function saveChat (json) {
    return fs.writeFileSync('db.json', JSON.stringify(json, null, 2));
}

const loadChats = (room) => {
    return JSON.parse(
        fs.existsSync('db.json') ? fs.readFileSync('db.json').toString() : '""'
    )
}



const chatSchema = new Schema({
    name : {
        type : String
    },
    msg : {
        type : String
    },
    room : {
        type : String
    },
    dateCreated : {
        type : Date,
        default : Date.now()
    }
});

/*For every Schema you create (create a schema per collection), you must also create a model
The model will allow you to perform CRUD operations on a given collection*/

const mongoChat = mongoose.model('Chat', chatSchema);




const tech = io.of('/tech');
const users = {};

tech.on('connection', function (socket) {
    
    // 1a. Listen for user about to join a room (called on load in client-side)
    socket.on('join', (data) => {

        socket.join(data.room); //  1b. Identify the appropriate room to work with from data passed in client

        /*1c. Save current user name on 'join' event. This will be used later to compare if its same 
        user on form 'submit' event.*/
        users[socket.id] = data.name; 

        // console.log(users);
        users['room'] = data.room;

        // 1d. Broadcast a welcome message (Load chats when user first joins room)
        // In other words let users know a new user joined. Thats what 'socket.broadcast' does
        // A simple message saying '$username has connected' is enough.
        // Thus the only data needed is the name of the logged in user that will be
        // obtained from data. i.e. data.name 
        if (data.name != null) {

            socket.broadcast.emit('user-connected', data);

            // 1e. Now load the chats for your own interface. 'You' don't need to load chats for 
            // the others because the code will be personalised for them too. Thus, as you're the
            // user now, so they are on their machine. 

            mongoChat.find({room : data.room}, function(err, docs) {
                if (err) {
                    throw err;
                }
                console.log(data.room);
                console.log("Load old messages for newly joined user");
                socket.emit("load-chats", docs);
                console.log("THE DOCS : ", docs);
                //tech.in(data.room).emit("load-old-msgs", docs);
            })

            // console.log(users[socket.id]);
            // load chats to only yourself (privately) to avoid displaying 2ce

           // socket.emit('load-chats', { chats : chatsDB["chats"], otherName: users[socket.id], moniker: data.userMoniker });
           // tech.in(data.room).emit('load-chats', { chats : chatsDB[data.room], user : users[socket.id], otherName: users[socket.id]});
        }

    });

    // 2a. Form has been submitted on client.
    // Display message to everyone, including yourself
    socket.on('message', (data) => {
        // console.log ("Message emitted. User: " + users[socket.id]);

            tech.in(data.room).emit('message', { message: data.chatMsg, otherName: data.name});
    });

    socket.on('mongo-save', (data) => {
        const newMsg = new mongoChat({msg : data.html, room: data.room, otherName : users[socket.id]});
        newMsg.save(function (err) {
            if (err) throw err;
        });
    });

    // Typing... event
    socket.on('typing', (data) => {
       if(data.typing==true) {
            socket.broadcast.emit('display', data);
       } else {
            socket.broadcast.emit('display', data);
       }
    });

});
