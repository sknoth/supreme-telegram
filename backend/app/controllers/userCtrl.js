/**
 * Created by asoadmin on 2017-04-28.
 */

var User = require('../models/user.js');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports.createUser = function (req,callback) {

    // create the user
    var newUser = new User();

    newUser.name = req.body.name || '';
    newUser.surname = req.body.surname || '';
    newUser.role = req.body.role;
    newUser.team = req.body.team ||'';
    newUser.location = req.body.location || {x:0,y:0};

    newUser.save(function(err,user) {

        if (err){
            console.log(err);
            callback(null);
        }


        callback(user);
    });
};


module.exports.setTeam = function (userId,team,callback) {
      User.findOne({_id:new ObjectId(userId.toString())},function (err,user) {
          if(!err){
              user.team = team;

              user.save(function (err,updatedUser) {
                  callback(updatedUser);
              })
          }
          else{
              callback(null);
          }
      })
};