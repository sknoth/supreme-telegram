// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// define the schema for our user model
var userSchema = mongoose.Schema({
    name: String,
    surname: String,
    role: String, //[LEADER,NURSE,RESERVE_NURSE] - should be enum
    team: {type:{name:String,doctor:String},default:null}, //leader does not have a team,default value is null, can not be empty
    points: {type:Number,default:0},
    location:{x:Number,y:Number},

    /**Fields that will be always updated in the game**/
    actions:[], //Object, it is difficult to define the general schema for action, since different roles can have different fields in actions
    patients:[{type:ObjectId,ref:'Patient'}]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
