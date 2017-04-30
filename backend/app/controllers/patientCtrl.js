/**
 * Created by asoadmin on 2017-04-28.
 */
var Patient = require('../models/patient.js');

module.exports.createPatient = function (req,callback) {

    var newPatient = new Patient();
    newPatient.identificator = req.body.identificator;
    newPatient.name = req.body.patientName;
    newPatient.age = req.body.patientAge;
    newPatient.gender = req.body.patientGender;
    newPatient.type = req.body.patientType;
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

    newPatient.treatments = [];
    if (req.body.treatments != undefined) {

        for (var i = 0; i < req.body.treatments.length;i++){
            newPatient.treatments.push(req.body.treatments[i]);
        }
    };

    newPatient.provided_treatments = [];
    newPatient.teams = [];
    newPatient.location = "Accident Place";


    newPatient.save(function (error,result) {
        if(!error){
            callback(result);
        }
        else{
            console.log("ERROR:Create new patient " + error);
            callback(null);
        }
    })

};