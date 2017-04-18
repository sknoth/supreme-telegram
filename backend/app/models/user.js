// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    name: String,
    surname: String,
    role: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
