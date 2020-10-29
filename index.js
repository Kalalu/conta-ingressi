var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log('a user connected');
	fs.readFile( __dirname + '/counter.txt', 'utf-8', function (err, data) {
		if (err) {
			throw err; 
		}
		console.log(data);
		io.emit('init', data);
	});

	socket.on('disconnect', () => {
    	console.log('user disconnected');
	});

	socket.on('value', (v) => {
  		io.emit('value', v);
  		fs.writeFile('counter.txt', v, function (err) {
	  		if (err) return console.log(err);
	  		console.log('Salvataggio > counter.txt');
  		});
    	console.log('visitatori: ' + v);
  	});
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});