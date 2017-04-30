/**
 * Created by asoadmin on 2017-04-28.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// define the schema for our game model
var resultSchema = mongoose.Schema({

    /**Fields that will be always updated in the game**/
    text:String,//Success of Fail
    RedPatients: [{type:ObjectId,ref:'Patient'}], //patients that has been red
    OrangePatients:[{type:ObjectId,ref:'Patient'}],
    YellowPatients:[{type:ObjectId,ref:'Patient'}],
    GreenPatients:[{type:ObjectId,ref:'Patient'}],
    BlackPatients:[{type:ObjectId,ref:'Patient'}], //dead patients


});

// create the model for users and expose it to our app
module.exports = mongoose.model('Result', resultSchema);