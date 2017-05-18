var User = require('../app/models/user');
var scenarioCtrl = require('./controllers/scenarioCtrl.js');
var userCtrl = require('./controllers/userCtrl.js');
var gameCtrl = require('./controllers/gameCtrl.js');


module.exports = function(app) {

    app.post('/scenario',function (req,res) {

        scenarioCtrl.createScenario(req,function (result) {
            if(result != null){
                res.send(result);
            }
            else{
                res.send("ERROR");
            }
        })

    });


    app.post('/patient',function (req,res) {

        scenarioCtrl.addPatient(req,res);

    });

    app.get('/scenarios',function (req,res) {

        scenarioCtrl.getAllScenarios(function (result) {
            if(result != null){
                res.send({data:result});
            }
            else{
                res.send("ERROR");
            }
        })

    });

    app.get('/scenario/:id',function (req,res) {
        console.log(req.params.id);
        scenarioCtrl.getScenarioById(req.params.id,function (result) {
            if(result != null){
                res.send(result);
            }
            else{
                res.send("ERROR");
            }
        })

    });



    /**
     * Adds a new user to User table
     *
     * @param  {type} '/users'
     */
    app.post('/user', function(req, res) {

        console.log('create a user', req.body);
        userCtrl.createUser(req,function (user) {
            res.send(user);
        });

      // create the user
      // var newUser = new User();
      //
      // newUser.name = req.body.name || '';
      // newUser.surname = req.body.surname || '';
      // newUser.role = req.body.role || '';
      // newUser.team = req.body.team || '';
      //
      // newUser.save(function(err) {
      //
      //     if (err)
      //         res.json({ message: 'error!' + err });
      //
      //   return res.send({ 'user': newUser, 'new': true });
      // });

      // // look for user in db
      // User.findOne({ '_id' :  req.body.id }, function(err, user) {
      //
      //     // if there are any errors, return the error
      //     if (err)
      //         res.json({ message: 'error!' + err });
      //
      //     // check to see if this user already exists
      //     if (user) {
      //         // found existing user
      //         return res.send({ 'user': user, 'new': false });
      //
      //     } else {
      //
      //         // create the user
      //         var newUser = new User();
      //
      //         newUser.name = req.body.name;
      //         newUser.surname = req.body.surname;
      //         newUser.role = req.body.role;
      //         newUser.team = req.body.team
      //
      //         newUser.save(function(err) {
      //
      //             if (err)
      //                 res.json({ message: 'error!' + err });
      //
      //           return res.send({ 'user': newUser, 'new': true });
      //         });
      //     }
      // });
    });

    app.get('/users', function(req, res) {

      User.find({}, function(error, results) {
        if (error) {
          console.log('error', error);
        } else {
          console.log('success', results);
          return res.send({ 'users': results});
        }
      });
    });

    app.get('/users/:id', function(req, res) {

      console.log('getting a user by id');

      User.findById(req.params.id, function(err, user) {

        if (err)
          return res.send(err);

        return res.send(user);
  		});
    });


    /**
     * Update a user
     */
    app.post('/users/update', function(req, res) {
      console.log("update the user");

      User.findById(req.body._id, function(err, user) {

        console.log('posting a user by id');

        if (err)
          return res.send({ message: 'error with request' });

        user.points = req.body.points;
        user.location = req.body.location;
        user.actions = req.body.actions;
        user.patients = req.body.patient;

        // if(user.actions){
        //     user.actions.push.apply(user.actions,req.body.actions);
        // }
        // else{
        //     user.actions =[];
        //
        //     user.actions.push.apply(user.actions,req.body.user.actions);
        // }
        //
        // if(user.patients){
        //     user.patients.push.apply(user.patients,req.body.patients);
        // }
        // else{
        //     user.patients = [];
        //     user.patients.push.apply(user.patients,req.body.patients);
        // }

  			user.save(function(err,newUser) {
                console.log("user was updated");
                console.log(newUser);

  			    if (err) {
                  console.log('err', err);
                  return res.send({ message: 'error updating user' });

                }

                console.log('NO err');

  				return res.send({ message: 'user updated!' });
  			});
  		});
    });
};
