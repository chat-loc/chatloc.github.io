const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*createdBy and dateCreated are 2 important things when creating a DB.
Just good practice*/

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    /*dateCreated : {
        type : Date,
        required : Date.now()
    },*/
    password : {
        type : String,
        required : true
    },
    origin : {
        type : String,
        required : true
    },
    sex : {
        type : String,
        required : true
    }
    /*,
    profilePic : {
        type : String, 
    },
    location : {
        type : String,
        required : true
    }*/
});

/*For every Schema you create (create a schema per collection), you must also create a model
The model will allow you to perform CRUD operations on a given collection*/

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;