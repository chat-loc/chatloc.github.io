const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config({path:"./config/key.env"});

const app = express();
app.use(cors());
app.use(express.json());

// Set up socket
const server = require('http').Server(app);
const io = require('socket.io')(server);

// BodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));
//express static middleware
app.use(express.static("public"));

const Schema = mongoose.Schema;


// Import router objects
const userRoutes = require("./controllers/User");
const generalRoutes = require("./controllers/General");

// User Routes
app.use("/", generalRoutes);
app.use("/user", userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}
                    ).then(()=> {
                        console.log(`Connected to MongoDB Database`);
                    }).catch(()=> {
                        console.log (`Error occured when connecting to the database ${err}`);
                    });
const PORT = process.env.PORT || 5003;


server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


// PREPARE CHAT SCHEMA
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

const tech = io.of('/tech');	// Do not use this if working in React. (Doesn't work)

const users = {};	// DB for temporary usage

io.on('connection', function (socket) {

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

	        mongoChat.find({room : `${data.room}-room`}, function(err, docs) {
	            console.log("FETCH FROM THIS ROOM IN DB: ", data.room);
	            if (err) {
	                throw err;
	            }
	            console.log("Load old messages for newly joined user");
	            socket.emit("load-chats", docs);
	            console.log("THE DOCS : ", docs);
	        });

	        // console.log(users[socket.id]);
	        // load chats to only yourself (privately) to avoid displaying 2ce

	       // socket.emit('load-chats', { chats : chatsDB["chats"], otherName: users[socket.id], moniker: data.userMoniker });
	       // tech.in(data.room).emit('load-chats', { chats : chatsDB[data.room], user : users[socket.id], otherName: users[socket.id]});
	    }

	});

});