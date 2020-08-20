const express = require('express');
const moment = require("moment");
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');	// Req'd for heroku deployment too!

require('dotenv').config({path:"./config/key.env"});

// Import router objects
const userRoutes = require("./controllers/User");

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

app.use((req,res,next)=>{

    if(req.query.method=="PUT")
    {
        req.method="PUT"
    }

    else if(req.query.method=="DELETE")
    {
        req.method="DELETE"
    }

    next();
})

const Schema = mongoose.Schema;

// User Routes
app.use("/user", userRoutes);

// Serve static assets in prod
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}
                    ).then(()=> {
                        console.log(`Connected to MongoDB Database`);
                    }).catch(()=> {
                        console.log (`Error occured when connecting to the database ${err}`);
                    });
const PORT = process.env.PORT || 5003;


// PREPARE CHAT SCHEMA
const locChatSchema = new Schema({
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

const mongoChat = mongoose.model('locChat', locChatSchema);

// const tech = io.of('/tech');	// Do not use this if working in React. (Doesn't work)

const users = {};	// DB for temporary usage

io.on('connection', function (socket) {

	// 1a. Listen for user about to join a room (called on load in client-side)
	socket.on('join', (data) => {

	    socket.join(data.room); //  1b. Identify the appropriate room to work with from data passed in client

	    /*1c. Save current user name on 'join' event. This will be used later to compare if its same 
	    user on form 'submit' event.*/
	    users[socket.id] = data.name; 

	    console.log("USER'S NAME, VIA SOCKET ID WAS SAVED : ", users[socket.id]);
	    users['room'] = data.room;

	    // 1d. Broadcast a welcome message (Load chats when user first joins room)
	    // In other words let users know a new user joined. Thats what 'socket.broadcast' does
	    // A simple message saying '$username has connected' is enough.
	    // Thus the only data needed is the name of the logged in user that will be
	    // obtained from data. i.e. data.name 
	    if (data.name != null) {

	    	// console.log("DATA FROM USER: ", data);
	    	// console.log("DATA LOADED : ", data.room); 

	    	// { name: 'sofia', room: 'etobicoke-north', connected: 'connected' }
	    	console.log("---Data on Join : ", {...data, ...{connected : "connected"}});

	    	// Emit message to other 
	    	socket.broadcast.to(data.room).emit("user-connected", {...data, ...{connected : "connected"}});

	        // console.log(users[socket.id]);
	        // load chats to only yourself (privately) to avoid displaying 2ce

	    }

	});


	// 2a. Form has been submitted on client.
	// Display message to everyone, including yourself
	socket.on('message', (data) => {
	    console.log ("---Message emitted (User): " + users[socket.id]);
	    console.log ("---Message to be saved: " + data.message);
	    console.log ("---Room to be saved: " + data.room);

	    let timestamp, datetime;

	    const newMsg = new mongoChat({msg : data.message, room: data.room, name : users[socket.id]});
	    newMsg.save(function (err, chatDoc) {
	        if (err) throw err;
	        if (chatDoc) {
	        	datetime = chatDoc.dateCreated;
	        	timestamp = moment(datetime).format("lll");	// Jun 9 2014 9:32 PM

	        	console.log("---Datetime: ", datetime);
	        	console.log("---Timestamp : ", timestamp);
	        	console.log("RECORD HAS BEEN SAVED TO MONGODB");
	        }

	        // Send data back in this format :
	        // {message: message, timestamp: 2020-08-14T01:28:24.913Z, datetime: 2020-08-14T03:37:53.389+00:00, name: name}

	        // The timestamp is formatted for humans while the datetime is passed for the <date datetime attribute
	        // in the HTML 
	        io.in(data.room).emit('sendMessage', { msg: data.message, timestamp, name: users[socket.id]});

	        // io.to(user.room).emit('message', {user: user.name, text: message});	
	    });	    
	});


	// 3a. 

	// Typing... event
	socket.on('typing', (data) => {
	    socket.broadcast.emit('typing', data);
	});

	// 4a Disconnect event

	socket.on('disconnect', () => {
		// Emit message to other 
		socket.broadcast.emit("user-disconnected", users[socket.id]);
		delete users[socket.id];
	});


});


server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
