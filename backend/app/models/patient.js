/**
 * Created by asoadmin on 2017-04-28.
 */
var mongoose = require('mongoose');


// define the schema for our user model
var patientSchema = mongoose.Schema({
    /**Static fields*/
    //fields bellow provided by the admin/expert
    identificator:String,// patient A, patient B, etc.
    name: String,
    age: Number,
    gender:String,
    triage:String,//[RED,ORANGE,YELLOW,GREEN,BLACK]
    injures: [{type:String}], //list of injures
    airway:Object,//{type:[OK, THREAD,BLOCKED],description:String}
    breathing:Object, //{RP:[Fast >30,Normal >10 >30,etc.],SPO2:String,CIANOSIS:[etc.], description:String}
    circulation:Object,//similar to breathing see table from the scenario + casuality card
    disability:Object,//similar to breathing see table from the scenario + casuality card
    exposure:Object,//similar to breathing see table from the scenario + casuality card


    /**Updated fields**/
    provided_treatments:[],// list of treatments has been chosen by a nurse/team
    teams:[{type:String}], // teams that were assigned to this patient, we assume by default one team, but can be that two teams treat one patient
    location:String   //was send by nurse to Corridor,AVA,OP,IVA, X-REY, etc.

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Patient', patientSchema);