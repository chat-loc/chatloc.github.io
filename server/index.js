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

const tech = io.of('/tech');
const users = {};

tech.on('connection', function (socket) {


});