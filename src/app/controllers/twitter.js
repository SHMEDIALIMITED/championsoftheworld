var twitter = require('ntwitter');
var current = {text:'Australia'};
var Tweet = require('../models').Tweet;
var countries = require('../models').Countries;

module.exports = function(app, config, io) {
	var twit = new twitter(config.twitter);

	twit.stream('statuses/filter', {track:config.hashtag}, function( stream) {
		stream.on('data', function (data) {
			var country = getCountryForText(data.text);
			var tweet = new Tweet({tweet:data, country:country}); 
			tweet.save();
			
			if(!country) {
				respondToError(data);
				return;
			}

			
			current = data;		
	   		io.sockets.emit('update', tweet);	 
	  	});
	});
}

function respondToError(data) {
  // Let tweeter know that country did not validate
  console.log('respond to error')
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