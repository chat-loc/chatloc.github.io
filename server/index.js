const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config({path:"./config/key.env"});

const app = express();
app.use(cors());
app.use(express.json());

// BodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));
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


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});