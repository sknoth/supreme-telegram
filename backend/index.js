var app = require('express')();
var http = require('http').Server(app);
var bodyParser   = require('body-parser');
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var io = require('socket.io')(http);

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
});

require('./app/routes.js')(app);

http.listen(port, function() {
  console.log('listening on *:' + port);
});
