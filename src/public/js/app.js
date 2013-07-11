define([ 
	'controller/Router',
	'model/CountryModel',
	'model/Tweet',
	'view/WebGL',
	'view/Overlay',
	'view/QueueView',
	'view/Notification',
	'view/FlagFallback',
	'libs/detectmobilebrowser',

	], function(
		Router, 
		CountryModel,
		Tweet,
		WebGL,
		Overlay,
		QueView,
		Notification,
		FlagFallback) {

	var router;
	var countries;
	var queue;
	var socket;
	var flag;
	var overlay;
	var queueView;
	var notification;

	var t = 0;
	

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
			socket.on('invalid', this.showValidationxError);

			if(!$.browser.mobile) {
				flag = new FlagFallback({basePath:'img/webgl/'});
				queueView = new QueView({collection:queue, basePath:'img/mobile/'});
			}else {
				flag = new WebGL({basePath:'img/webgl/'});
				queueView = new QueView({collection:queue, basePath:'img/webgl/'});
			}
			overlay = new Overlay({collection:countries, hashtag:options.hashtag, host:options.host});


			queue.add(options.collection);

			notification = new Notification({collection:queue});

			
			$(window).resize(function() {
				flag.resize();
		 	});
		 	flag.resize();

		 	this.showNextTweetFromQue();
		 	
		 	setInterval(_.bind(this.showNextTweetFromQue , this), 20000);
		},

		test: function() {
			var end = t+17;
			if(end > countries.length) end = countries.length - 1;
			queueView.renderTest(countries.slice(t, end));
			t+= 17
		},

		onTweeted : function(url) {
			tweetedURL = url;
		},

		showValidationxError : function(data) {
			// Check if it was current user
			console.log('showValidationxError', data.text, overlay.tweet)
			if(data.text.indexOf(overlay.tweet) != -1) {
				console.log('TWEET invalid')
			}
		},

		startTweet : function() {
			overlay.show();
		},

		
		showNextTweetFromQue: function() {
			var tweet = queue.shift();
			if(tweet) {
				flag.loadTexture(tweet.get('country') + '.jpg');
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