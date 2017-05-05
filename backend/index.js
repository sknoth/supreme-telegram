var app = require('express')();
var http = require('http').Server(app);
var bodyParser   = require('body-parser');
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var io = require('socket.io')(http);

var userCtrl = require('./app/controllers/userCtrl.js');
var gameCtrl = require('./app/controllers/gameCtrl.js');

/**
 * Enable CORS Requests across domains
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  next();
});

var configDB = require('./app/config/database.js');
mongoose.connect(configDB.url); // connect to our database

// set up express application
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// will later be served from client app
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//{user:user,scenairoId:id,team:team}
var onlineUsers = [];

io.on('connection', function(socket) {

  socket.on('chat message', function(msg){
     io.emit('chat message', msg);
  });

  socket.on('add-message',function (message) {
      io.emit('message', {type:'new-message', text: message});
  });
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });


    socket.on('login',function (message) {

        console.log(message);


        var data = JSON.parse(message);

        //get all who log in in the same game scenario
        var allusers = onlineUsers.filter(function (item) {
            return (item.scenarioId === data.scenarioId);
        });



        var nurses = allusers.filter(function (item) {
            return (item.team != null);
        });



        //check if it is a leader, disable the leader role
        if(data.user.role === "LEADER"){
            console.log("leader is log in");
            onlineUsers.push({user:data.user,scenarioId:data.scenarioId,team:null});
            io.emit('message',{topic:'disable-leader',data: "Leader is log in already"});

        }
        else{
            var teamIndex= nurses.length + 1;
            var team = {name:"Team" + teamIndex,doctor:data.doctor};
            onlineUsers.push({user:data.user,scenarioId:data.scenarioId,team:team});
            //update the user with a team

            userCtrl.setTeam(data.user._id,team,function (result) {
              if(result!=null){
                  console.log("success");
              }

            });

        }


        //get again all log in users to the game

        //get all who log in in the same game scenario
        var allusers = onlineUsers.filter(function (item) {
            return (item.scenarioId === data.scenarioId);
        });

        //check if we have a leader and 2 nurses
        var leader = allusers.filter(function (item) {
           return (item.user.role === "LEADER");
        });

        var nurses = allusers.filter(function (item) {
            return (item.team != null);
        });

        console.log(onlineUsers);

        if(leader.length>0 && nurses.length>=2){
           //GAME START
           console.log("GAME START!");
           var teams = nurses.map(function (nurse) {
               return nurse.user._id;
           })
           //create the game and send game id to all users
           gameCtrl.createGame(leader[0]._id,teams,allusers[0].scenarioId,function (game) {
               if(game!=null){
                   io.emit('message',{topic:'game-start',data:game});
               }
           })

        }




    });




});

require('./app/routes.js')(app);

http.listen(port, function() {
  console.log('listening on *:' + port);
});
