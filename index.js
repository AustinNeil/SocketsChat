var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');
app.use(express.static(path.join(__dirname, 'public')));

// set the / route
app.get('/', function(req, res){
	// render index.html
	res.sendFile(__dirname + '/index.html');
});

// on instance connection to the server
io.on('connection', function(socket){
	// when client side emits "connection"...
	socket.on('connection', function(){
		// emit to all users a new connection (pass to client side)
		io.emit('new connection');
	});

	// when client side emits "chat message"...
	socket.on('chat message', function(msg){
		// emit to all users a new message (pass to client)
		io.emit('chat message', msg);
	});

	// when  a user has been added from client side
	socket.on('add user', function(username){
		// store the username in their unique socket
		socket.username = username;
	});

	// when a user has connected on client side
	socket.on('new connected user', function(){
		socket.broadcast.emit('new connected user', socket.username);
	});

	// when client side emits "disconnect"
	socket.on('disconnect', function(){
		// emit to all users a lost connection (pass to client)
		io.emit('lost connection');
	});
});
// listen on port 3000
http.listen(3000,function(){
	// when server initializes, do this
	console.log("Listening on *:3000....");
});

