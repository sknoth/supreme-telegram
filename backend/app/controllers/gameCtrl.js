/**
 * Created by asoadmin on 2017-04-28.
 */
//models
var Game = require('../models/game.js');
var ObjectId = require('mongoose').Types.ObjectId;

//controllers
var ResultCtrl = require('./resultCtrl.js');

module.exports.createGame = function (leaderId,teams,scenarioId,callback) {

    //check if the game with this scenarioId 
    

    
    var game = new Game();
    game.scenario = scenarioId;
    game.leader = leaderId;
    game.teams = [];
     for(var i=0;i<teams.length;i++){
         game.teams.push(teams[i]);
     }

    

    //create object Result
    ResultCtrl.createResult(function (newEmptyResult) {
        if(newEmptyResult !=null){
            game.result = newEmptyResult._id;

            game.save(function (error,result) {
                if(!error){
                    //console.log(result);

                    Game.findOne({_id:new ObjectId(result._id).toString()}).populate('leader').populate('teams').populate('scenario').exec(function (err,result) {
                        if(!err){
                            console.log(result.toString());
                            callback(result);
                        }
                    })

                }
                else{
                    callback(null);
                }
            })
        }

    });
};


module.exports.gameLogIn = function () {
    
}


