define([ 
	'controller/Router',
	'model/CountryModel',
	'model/Tweet',
	'view/WebGL',
	'view/Overlay',
	'view/QueueView',
	'view/Notification'

	], function(
		Router, 
		CountryModel,
		Tweet,
		WebGL,
		Overlay,
		QueView,
		Notification) {

	var router;
	var countries;
	var queue;
	var socket;
	var webGL;
	var overlay;
	var queueView;
	var notification;

	return Backbone.View.extend({


		el : 'body',

		events : {
			'click #tweet-btn' : 'startTweet'
		},

		initialize: function(options) {
			
			router = new Router();
			Backbone.history.start();

			countries = new CountryModel();
			queue = new Backbone.Collection();

			socket = io.connect(options.host);
			socket.on('update', this.onAddedToQue);

			webGL = new WebGL();
			$(window).resize(function() {
				webGL.resize();
		 	});
		 	webGL.resize();

		 	overlay = new Overlay({collection:countries, hashtag:options.hashtag});
		 	
		 	overlay.countrySelected.add(function(country) {
		 		webGL.loadTexture('img/webgl/' + country + '.jpg');
		 	});

		 	queueView = new QueView({collection:queue});
		 	queue.add(options.collection);
		 	notification = new Notification({collection:queue});


		 	this.showNextTweetFromQue();
		 	setInterval(_.bind(this.showNextTweetFromQue , this), 20000);
		},

		startTweet : function() {
			overlay.show();
		},

		
		showNextTweetFromQue: function() {
			var tweet = queue.shift();
			if(tweet) {
				webGL.loadTexture('img/webgl/' + tweet.get('country') + '.jpg');
			}
		},

		onAddedToQue: function(data) {
			
			var tweet = new Tweet(data)

			// Validate tweet
			if(tweet.get('country')) {
				queue.add(tweet);
			} else {
				// Let user know by theeting back
			}
		}
	})
})