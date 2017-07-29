var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// set the / route
app.get('/', function(req, res){
	// render index.html
	res.sendFile(__dirname + '/index.html');
});

// on instance connection to the server
io.on('connection', function(socket){
	// when client side emits "connection"...
	socket.on('connection', function(user){
		// emit to all users a new connection (pass to client side)
		io.emit('new connection', user);
	});
	// when client side emits "chat message"...
	socket.on('chat message', function(msg){
		// emit to all users a new message (pass to client)
		io.emit('chat message', msg);
	});
	// when client side emits "disconnect"
	socket.on('disconnect', function(){
		// emit to all users a lost connection (pass to client)
		io.emit('lost connection', user);
	});
});
// listen on port 3000
http.listen(3000,function(){
	// when server initializes, do this
	console.log("Listening on *:3000....");
});

