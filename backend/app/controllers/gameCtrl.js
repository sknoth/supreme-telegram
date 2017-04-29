/**
 * Created by asoadmin on 2017-04-28.
 */
//models
var Game = require('../models/game.js');

//controllers
var ResultCtrl = require('./resultCtrl.js');

module.exports.createGame = function (req,res,callback) {

    var game = new Game();
    game.scenario = req.body.scenarioId;
    game.teams = [];


    //create object Result
    ResultCtrl.createResult(function (newEmptyResult) {
        if(newEmptyResult !=null){
            game.result = newEmptyResult._id;

            game.save(function (error,result) {
                if(!error){
                    console.log(result);
                    res.send("OK");
                }
            })
        }

    });
};


