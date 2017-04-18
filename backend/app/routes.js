var User = require('../app/models/user');

module.exports = function(app) {

    /**
     * Adds a new user to User table
     *
     * @param  {type} '/users'
     */
    app.post('/users', function(req, res) {

      console.log('create a user', req.body);
      // create the user
      var newUser = new User();

      newUser.name = req.body.name || '';
      newUser.surname = req.body.surname || '';
      newUser.role = req.body.role || '';
      newUser.team = req.body.team || '';

      newUser.save(function(err) {

          if (err)
              res.json({ message: 'error!' + err });

        return res.send({ 'user': newUser, 'new': true });
      });

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
    app.post('/users/:id', function(req, res) {

      User.findById(req.params.id, function(err, user) {

        console.log('posting a user by id');

        if (err)
          return res.send({ message: 'error with request' });
console.log(req.body);

        user.name = req.body.name || '';
        user.surname = req.body.surname || '';
        user.role = req.body.role || '';

  			user.save(function(err) {

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
