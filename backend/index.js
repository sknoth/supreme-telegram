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


        if(data.user.role === "LEADER"){
            console.log("leader is log in");
            onlineUsers.push({user:data.user,scenarioId:data.scenarioId,team:null});
            io.emit('message',{topic:'disable-leader',data: "Leader is log in already"});


        }
        else{
            var teamIndex= nurses.length + 1;
            var deltaX = teamIndex*30;
            var team = {name:"Team" + teamIndex,doctor:data.doctor,x:190+deltaX,y:320};
            onlineUsers.push({user:data.user,scenarioId:data.scenarioId,team:team});
            //update the user with a team

            userCtrl.setTeam(data.user._id,team,function (result) {
                if(result!=null){
                    console.log("success");

                }

            });

        }




        //check if the game is already exists
        gameCtrl.isGameExists(data.scenarioId,function (games) {
            if(games != null){
                if(games.length>0){
                     //join the game
                    console.log("game exists");
                    gameCtrl.joinGame(games[0]._id,data.user,function (updatedGame) {
                        console.log("send join-game message");
                        io.emit('message',{topic:'join-game',data:updatedGame});

                        if(updatedGame.leader!=null && updatedGame.teams.length==2){
                            console.log("send game start!");
                            io.emit('message',{topic:'game-start',data:updatedGame});
                            //start timer
                            //should be moved to another place
                            var countdown = updatedGame.scenario.duration*60;

                            var minutes=Math.floor(countdown / 60);
                            var seconds=countdown % 60;

                            setInterval(function() {




                                if (seconds == 0) {
                                    minutes--;
                                    seconds = 59;
                                }
                                if (seconds > 0) {
                                    seconds --;
                                }

                                if(minutes == 0){
                                    io.emit('message',{topic:'game-over',data:"GAME OVER"});
                                }


                                io.emit('message',{topic:'timer',data:{minutes:minutes,seconds:seconds}});

                            }, 1000);





                        }

                    });
                }
                else{
                    //create the game
                    console.log("create the game");
                    gameCtrl.createGame(data.scenarioId,data.user,function (newGame) {
                        console.log("send join-game message");
                        io.emit('message',{topic:'join-game',data:newGame});
                    })
                }
            }
        })


    });




});

require('./app/routes.js')(app);

http.listen(port, function() {
  console.log('listening on *:' + port);
});
