/**
 * Created by asoadmin on 2017-04-28.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// define the schema for our game model
var scenarioSchema = mongoose.Schema({
    /**Static fields***/
    //provided by the admin/expert through admin view
    name: String,
    description: String,
    metana_report:String,
    ashet_report:String,
    duration: {type:Number,default:15}, //in minutes, if not specified by default is 15 minutes
    nPatients:{type:Number,default:8},
    patients:[{type:ObjectId,ref:'Patient'}],
    maxReservedNurses: {type:Number,default:5},
    nBusyRooms:{type:Number,default:0},
    info_bakjour:String

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Scenario', scenarioSchema);
