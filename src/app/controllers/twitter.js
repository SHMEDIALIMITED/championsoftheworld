var twitter = require('ntwitter');
var current = {text:'Australia'};

module.exports = function(app, config) {
	var twit = new twitter(config.twitter);

	var io = require('socket.io').listen(app);
	
	twit.stream('statuses/filter', {track:config.hashtag}, function( stream) {
		stream.on('data', function (data) {
			current = data;		
	   		io.sockets.emit('update', data);	 
	  	});
	});

	io.sockets.on('connection', function (socket) {
	  	socket.emit('news', { hello: 'PAtrick Wolleb' });
	});
}