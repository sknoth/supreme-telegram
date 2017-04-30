/**
 * Created by asoadmin on 2017-04-28.
 */

var User = require('../models/user.js');

module.exports.createUser = function (req,res,callback) {
    console.log('create a user', req.body);
    // create the user
    var newUser = new User();

    newUser.name = req.body.name || '';
    newUser.surname = req.body.surname || '';
    newUser.role = req.body.role;
    newUser.team = req.body.team;

    newUser.save(function(err) {

        if (err)
            res.json({ message: 'error!' + err });

        return res.send({ 'user': newUser, 'new': true });
    });
};


module.exports.getUsers = function (req,res,callback) {

};