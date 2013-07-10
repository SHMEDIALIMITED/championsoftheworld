var twitter = require('ntwitter');
var Tweet = require('../models').Tweet;
var countries = require('../models').Countries;

module.exports = function(app, config, io) {
	var twit = new twitter(config.twitter);

	//Heroku "doesn't support" websockets on the Cedar stack yet (no word on when they will). 
	//They recommend adding the following code to your Socket.io implementation:
	io.configure(function () { 
	  io.set("transports", ["xhr-polling"]); 
	  io.set("polling duration", 10); 
	});
	
	twit.stream('statuses/filter', {track:config.hashtag}, function( stream) {
		stream.on('data', function (data) {
			var country = getCountryForText(data.text);
			
			
			if(!country) {
				console.log('Invalid Country')
				io.sockets.emit('invalid', data);
				return;
			}

			var tweet = new Tweet({tweet:data, country:country}); 
			tweet.save();

	   		io.sockets.emit('update', tweet);
	  	});
	});
}

// private helper to validate tweet text if country is available
function getCountryForText(text) {
	var i = countries.length;
	var country;
	var regEx;
	while(--i > -1) {
		country = countries[i];
		regEx = '/' + country + '/g'
		if(text.indexOf(country) != -1)
			break;
		else
			country = false;
	}
	return country;
}