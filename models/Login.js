const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*createdBy and dateCreated are 2 important things when creating a DB.
Just good practice*/

const loginSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    countryLoc : {
        type : String,
        required : true
    },
    stateLoc : {
        type : String,
        required : true
    },
    districtLoc : {
        type : String,
        required : true
    },
    roadLoc : {
        type : String,
        required : true
    }
});

/*For every Schema you create (create a schema per collection), you must also create a model
The model will allow you to perform CRUD operations on a given collection*/

const loginModel = mongoose.model('Login', loginSchema);

module.exports = loginModel;