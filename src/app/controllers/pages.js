var Tweet = require('../models').Tweet;


module.exports = function(config) {
	var api = {};

	

	api.index = function(req, res) {
		Tweet.findOne({ country: {$ne: 'false'} }, {}, { sort: { 'created_at' : -1 } }, function(err, tweet) {
		  if(err || !tweet) {
		  	console.log('Could not find any tweets:', err)
		  	res.render('index', {layout:false,locals:{
				version:config.version, 
				title: 'Champions of the World', 
				description:'Flag WebGL',
				queue : '[]',
				host : config.host,
				hashtag: config.hashtag,
				scid: config.soundcloud.client_id}
			});
		  }else {

		  	var start = new Date();
			start.setMilliseconds(start.getMilliseconds() - 20000);

			var end = new Date();
			
			Tweet.find({"created_at": {"$gte": start, "$lt": end}}, function(err, tweets) {

				if(tweets.length == 0) {
					tweets.push(tweet);
				}
				res.render('index', {layout:false,locals:{
					version:config.version, 
					title: 'Champions of the World', 
					description:'Flag WebGL',
					queue : JSON.stringify(tweets),
					host : config.host,
					hashtag: config.hashtag,
					scid: config.soundcloud.client_id}
				});
			})
		  	
		 //  	twit.get('/statuses/show/' + tweet.tweetId + '.json', {include_entities:true}, function(err,data) {
		 //  		console.log('EMIT INIT', err, tweet.tweetId)
		 //    	io.sockets.emit('init', {text:'Switzerland'});
			// });
		  }
		});
		
		
	}

	api.canvas = function(req, res) {
		res.redirect('/');
	}
	return api;
}