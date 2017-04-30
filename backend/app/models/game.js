/**
 * Created by asoadmin on 2017-04-28.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// define the schema for our game model
var gameSchema = mongoose.Schema({
    /**Static fields***/
    scenario: {type: ObjectId, ref: 'Scenario'},

    /**Fields that will be updated later in the game**/
    leader:{type:ObjectId,ref:'User'},//leader that has been log in to the game and played the game
    teams: [{type:ObjectId,ref:'User'}], //teams that has been login to the game and played the game
    totalActions: {type:Number,default:0},// total number of actions made by all teams and leader together
    timeSpend:{type:String,default:'00:00'},//time when spent to finish the game in string format mm:ss (minutes:seconds)
    result:{type:ObjectId,ref:'Result'},//the overall result of the game

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Game', gameSchema);
