define([ 
	'controller/Router',
	'model/CountryModel',
	'io',
	'view/WebGL',
	'view/Overlay'

	], function(
		Router, 
		CountryModel,
		io,
		WebGL,
		Overlay) {

	var router;
	var countries;
	var socket;
	var webGL;
	var overlay;
	var que;

	// private method to get country from tweet text
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
				country = 'Country not found';
		}
		return country;
	}

	return {
		init: function() {
			
			router = new Router();
			Backbone.history.start();

			countries = new CountryModel();
			que = new Backbone.Collection();

			socket = io.connect('http://champions-of-the-world.herokuapp.com');
			socket.on('update', this.onAddedToQue);


			webGL = new WebGL();
			webGL.loadTexture('img/webgl/Europe.jpg');
			$(window).resize(function() {
				webGL.resize();
		 	});
		 	webGL.resize();

		 	overlay = new Overlay({collection:countries});
		 	//overlay.show();
		 	overlay.countrySelected.add(function(country) {
		 		webGL.loadTexture('img/webgl/' + country + '.jpg');
		 	});
		 	var index = 0;
		 	setInterval(_.bind(function() {
		 		webGL.loadTexture('img/webgl/' + countries[index]+ '.jpg');
		 		index++;
		 	} , this), 10000);
		 	setInterval(_.bind(this.showNextTweetFromQue , this), 20000);
		},

		showNextTweetFromQue: function() {
			var tweet = que.shift();
			if(tweet) {
				webGL.loadTexture('img/webgl/' + getCountryForText(tweet.get('text')) + '.jpg');
			}
		}, 

		onAddedToQue: function(data) {
			console.log('UPDATE FROM SOCKET', data)
			var tweet = new Backbone.Model(data);
			que.add(tweet);
			//$('#cue ul').prepend("<li class='cueit' data-twitter='" + JSON.stringify(data) + "'><p>" + data.user.screen_name + "</p></li>");
		}
	}
})