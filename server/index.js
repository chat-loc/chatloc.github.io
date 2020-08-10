const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(express.json());

// BodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));



const chatRouter = require('./routes/chat');

app.use('/chat', chatRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}
                    ).then(()=> {
                        console.log(`Connected to MongoDB Database`);
                    }).catch(()=> {
                        console.log (`Error occured when connecting to the database ${err}`);
                    });
const PORT = process.env.PORT || 5003;


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
