/**
 * Created by asoadmin on 2017-04-28.
 */
var Patient = require('../models/patient.js');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports.createPatient = function (req,callback) {
    console.log("Create patient");
    //console.log(req.body);

    var newPatient = new Patient();
    newPatient.identificator = req.body.identificator;
    newPatient.name = req.body.name;
    newPatient.age = req.body.age;
    newPatient.gender = req.body.gender;
    newPatient.triage = req.body.triage;
    newPatient.injures = [];
    if (req.body.injures != undefined) {

        for (var i = 0; i < req.body.injures.length;i++){
            newPatient.injures.push(req.body.injures[i]);
        }
    };
    newPatient.airway = req.body.airway;
    newPatient.breathing = req.body.breathing;
    newPatient.circulation = req.body.circulation;
    newPatient.disability = req.body.disability;
    newPatient.exposure = req.body.exposure;


    newPatient.provided_treatments = [];
    newPatient.teams = [];
    newPatient.location = "Accident Place";


    newPatient.save(function (error,result) {
        if(!error){
            console.log("Patient was created successfully");

            callback(result);
        }
        else{
            console.log("ERROR:Create new patient " + error);
            callback(null);
        }
    })

};


module.exports.updatePatient = function (patient,callback) {
    console.log("Update patient");
    console.log(patient);

    Patient.findOne({_id:new ObjectId(patient._id.toString())},function (err,oldPatient) {
       if(!err){
           oldPatient.coordinates = patient.coordinates;
           oldPatient.locations = patient.locations;
           oldPatient.visibility = patient.visibility;
           oldPatient.imgUrl = patient.imgUrl;
           oldPatient.coordinates = patient.coordinates;
           oldPatient.locations = patient.locations;


           oldPatient.save(function (err,updatedPatient) {
               if(!err){
                   callback(updatedPatient);
               }
           })
       }
    });



};