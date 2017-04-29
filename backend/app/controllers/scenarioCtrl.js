/**
 * Created by asoadmin on 2017-04-28.
 */
var Scenario = require('../models/scenario.js');
var PatientCtrl = require('./patientCtrl.js');
var ObjectId = require('mongoose').Types.ObjectId;

/*Create new scenario for the game*/
module.exports.createScenario = function (req,callback) {

    var newScenario = new Scenario();
    newScenario.name = req.body.scenarioName;
    newScenario.description = req.body.scenarioDescription;
    newScenario.nPatients = req.body.numberOfPatient;
    newScenario.duration = req.body.duration;
    newScenario.patients = [];
    newScenario.maxReservedNurses = req.body.numberOfReservedNurses;
    newScenario.nBusyRooms = req.body.numberOfOccupiedRooms;
    newScenario.info_bakjour = req.body.info_bakjour;

    newScenario.save(function (error,result) {
        if(!error){
           callback(result);
        }
        else{
            console.log("Error:Create a new Scenario " + error);
            callback(null);
        }
    });

};

/*Add patient to the scenario*/
module.exports.addPatient = function (req,res) {

    var scenarioId = req.body.scenarioId;

    PatientCtrl.createPatient(req,function (newPatient) {
        if(newPatient!=null){
            //get scenario by id
            this.getScenarioById(scenarioId,function (scenario) {
                if(scenario!=null){
                    scenario.patients.push(newPatient._id);

                    scenario.save(function (error,updatedScenario) {
                        if(!error){
                            res.send("OK");
                            console.log(updatedScenario);
                        }
                        else{
                            res.send("Something went wrong");
                            console.log("Error update scenario with id: " + scenarioId);
                        }
                    })
                }
            })
        }
    })
};


/**
 * Get Scenario by ObjectId
 * @param scenarioId - an id of the scenario that generated automatically in mongodb
 * @param callback - returns the scenario object
 */
module.exports.getScenarioById = function (scenarioId,callback) {
    Scenario.findOne({_id:new ObjectId(scenarioId.toString())},function (error,scenario) {
       if(!error){
           callback(scenario);
       }
       else{
           console.log("ERROR:getting scenario with id: " + scenarioId);
           callback(null);
       }
    });
};

/**
 * Get all scenarios
 * @param callback - an array of scenarios
 */
module.exports.getAllScenarios = function (callback) {
    console.log("Get all scenarios");
  Scenario.find({},function (error,scenarios) {
      if(!error){
          console.log(scenarios);
          callback(scenarios);
      }
      else{
          callback(null);
      }
  })
};

