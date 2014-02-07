define([ 
	'controller/Router',
	'model/CountryModel',
	'model/Tweet',
	'view/WebGL',
	'view/Overlay',
	'view/QueueView',
	'view/Notification',
	'view/FlagFallback',
	'view/SoundCloud',
	'libs/detectmobilebrowser',

	], function(
		Router, 
		CountryModel,
		Tweet,
		WebGL,
		Overlay,
		QueView,
		Notification,
		FlagFallback,
		SoundCloud) {

	var router;
	var countries;
	var queue;
	var socket;
	var flag;
	var overlay;
	var queueView;
	var notification;
	var sound;
    var tweet;

	var t = 0;
	
	// https://soundcloud.com/search?q=We%20are%20the%20champions

	// private 
	function hasWebGL() {

		if (!window.WebGLRenderingContext) {
		    // the browser doesn't even know what WebGL is
		    return false;
		  } else {
		    var canvas = document.createElement("canvas");
		    var context = canvas.getContext("webkit-3d");
		    if (!context) {
		    	context = canvas.getContext("moz-webgl");
		    	if(!context) {
		    		// browser supports WebGL but initialization failed.
		    		return false;
		    	}	
		      	
		     
		    }
		  }
		  return true;
	}

	

	return Backbone.View.extend({


		el : 'body',

		events : {
			'click #tweet-btn' : 'startTweet'
		},

		initialize: function(options) {
			
			router = new Router();
			Backbone.history.start();

			countries = new CountryModel();
            var Queue = Backbone.Collection.extend({
                model : Tweet
            })

			queue = new Queue();

			socket = io.connect(options.host);
			socket.on('update', this.onAddedToQue);
			socket.on('invalid', this.showValidationxError);
            socket.on('heartbeat', this.showNextTweetFromQue);
			console.log($.browser)
			if($.browser.mobile) {
				flag = new FlagFallback({basePath:'img/mobile/'});
				queueView = new QueView({collection:queue, basePath:'img/mobile/'});
			}else if(!hasWebGL()) {
				flag = new FlagFallback({basePath:'img/webgl/'});
				queueView = new QueView({collection:queue, basePath:'img/webgl/'});
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


		 	sound = new SoundCloud({client_id: options.soundcloud});
		 	sound.load('/tracks/58865296');

		 	console.log(this)

		 	this.showNextTweetFromQue();
		 	
		 	//setInterval(_.bind(this.showNextTweetFromQue , this), 60000);


		 	
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
			if(data.text.indexOf(overlay.tweet) != -1) {
				console.log('TWEET invalid')
			}
		},

		startTweet : function() {
			overlay.show();
		},

		
		showNextTweetFromQue: function() {
            if(tweet && tweet.get('queued')) tweet.save();
			tweet = queue.shift();
			if(tweet) {
				flag.loadTexture(tweet.get('country') + '.jpg');
				if(sound) {
                    sound.play(38000, 77000);
                }
			}
		},

		onAddedToQue: function(data) {
			
			var tweet = new Tweet(data)


            console.log('>>>> ADD', tweet)

			// Validate tweet
			if(tweet.get('country')) {
				queue.add(tweet);
			} else {
				// Let user know by theething back
			}
		}
	})
})