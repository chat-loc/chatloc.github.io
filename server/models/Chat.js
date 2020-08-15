const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*createdBy and dateCreated are 2 important things when creating a DB.
Just good practice*/

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

const chatModel = mongoose.model('locchats', chatSchema);

module.exports = chatModel;