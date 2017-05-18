/**
 * Created by asoadmin on 2017-04-28.
 */
//models
var Game = require('../models/game.js');
var ObjectId = require('mongoose').Types.ObjectId;

//controllers
var ResultCtrl = require('./resultCtrl.js');

module.exports.createGame = function (scenarioId,user,callback) {

    //check if the game with this scenarioId 
    //create the game




    var game = new Game();
    game.scenario = scenarioId;
    game.teams = [];
    console.log("inside");
    console.log(user.role);
    if(user.role==="LEADER"){
        game.leader = user._id;
    }
    else{
        game.teams.push(user._id);
    }

    //create object Result
    ResultCtrl.createResult(function (newEmptyResult) {
        if(newEmptyResult !=null){
            game.result = newEmptyResult._id;

            game.save(function (error,result) {
                if(!error){
                    //console.log(result);
                    console.log("game was created");
                    Game.findOne({_id:new ObjectId(result._id).toString()}).populate('leader').populate('teams').populate('scenario').exec(function (err,result) {
                        if(!err){
                            //console.log(result.toString());
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


module.exports.isGameExists = function (scenarioId,callback) {
    Game.find({scenario:new ObjectId(scenarioId.toString()),isPlayed:false},function (err,games) {
        if(!err){
            callback(games);
        }
        else{
            console.log(err);
            callback(null);
        }
    })
}

module.exports.joinGame = function (gameId,user,callback) {

    Game.findOne({_id:new ObjectId(gameId.toString())},function (err,game) {
        if(!err){

            if(user.role==="LEADER"){
                game.leader = user._id;
            }
            else{
                game.teams.push(user._id);
            }

            if(game.leader !=null && game.teams.length>0){
                game.isStarted = true;
            }
            game.save(function (err,updatedGame) {
                //get game with populated values for leader and teams
                getGameById(updatedGame._id,function (populatedGame) {
                    callback(populatedGame);
                })

            })

        }
        else{
            console.log(err);
            callback(null);
        }
    })

};


module.exports.leftGame = function (gameId,user,callback) {

        Game.findOne({_id:new ObjectId(gameId.toString())},function (err,game) {

            if(user.role === "LEADER"){
                game.leader = null;
                game.save(function (err,newGame) {
                    getGameById(newGame._id,function (populatedGame) {
                        callback(populatedGame);
                    })
                });
            }
            else{
               game.teams.splice(game.teams.indexOf(user._id),1);
               game.save(function (err,newGame) {
                   getGameById(newGame._id,function (populatedGame) {
                       callback(populatedGame);
                   })
               })
            }
        })


}


function getGameById(gameId,callback) {
    console.log("get game by id " + gameId);

    Game.findOne({_id:new ObjectId(gameId).toString()}).populate('leader').populate('teams').populate('scenario').exec(function (err,result) {
        if(!err){
            //console.log(result.toString());
            callback(result);
        }
        else{
            console.log("Could not find the game");
            console.log(err);
            callback(null);
        }
    })
}

module.exports.getGame = function (gameId,callback) {
    getGameById(gameId,callback);
}




