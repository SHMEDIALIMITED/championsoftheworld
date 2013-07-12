define([ 
	'controller/Router',
	'model/CountryModel',
	'model/Tweet',
	'view/WebGL',
	'view/Overlay',
	'view/QueueView',
	'view/Notification',
	'view/FlagFallback',
	'soundcloud',
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
		SC) {

	var router;
	var countries;
	var queue;
	var socket;
	var flag;
	var overlay;
	var queueView;
	var notification;
	var sound;

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

	function fadeInSound(amount) {
		s = sound;
		console.log('FADE', s)
		var vol = s.volume;
		if (vol == 100) return false;

		s.setVolume(Math.min(100,vol+amount));
		
		setTimeout(function(){
						console.log('FADE CALL') 
			fadeInSound(amount)
		},20);
	}

	function fadeOutSound(amount) {
		var s = sound;
		var vol = s.volume;
		if (vol == 0) {
			return false;
			s.stop();
		}
		s.setVolume(Math.max(0,vol-amount));
		setTimeout(function(){fadeOutSound(amount)},20);
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
			queue = new Backbone.Collection();

			socket = io.connect(options.host);
			socket.on('update', this.onAddedToQue);
			socket.on('invalid', this.showValidationxError);
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

		 	this.showNextTweetFromQue();
		 	
		 	setInterval(_.bind(this.showNextTweetFromQue , this), 20000);


		 	SC.initialize({
			  client_id: options.soundcloud
			});

			SC.stream("/tracks/58865296", function(track){

			  sound = track
			  
			  console.log(sound )
			  
			  sound.load({position:38600, onload : function() {
			  	
			  	console.log('FINISHED')
			  	sound.setVolume(0);
			  	sound.play();
			  	fadeInSound(5);


			  }});

			  sound.onPosition(77000, function() {
			  	fadeOutSound(5);
			  });	
			  

			  


			});

			

			
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
				if(sound) {
					sound.setPosition(38600);
					sound.setVolume(0);
			  		sound.play();
			  		fadeInSound(5);
				}
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