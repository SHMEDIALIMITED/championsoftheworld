var ObjectId = require('mongoose').Schema.Types.ObjectId;

var Tweet = require('../models').Tweet;


module.exports = function(config) {
	var api = {};

	

	api.index = function(req, res) {

        var start = new Date();
        start.setMilliseconds(start.getMilliseconds() - 60000);
        var end = new Date();

        Tweet.find({"queued": true}).sort('_id').exec(function(err, tweets) {

            console.log(err, tweets)

            if(tweets.length == 0) {
                Tweet.find().sort('-_id').limit(1).exec(function(err, tweets) {
                    return res.render('index', {layout:false,locals:{
                        version:config.version,
                        title: 'Champions of the World',
                        description:'Flag WebGL',
                        queue : JSON.stringify(tweets),
                        host : config.host,
                        hashtag: config.hashtag,
                        scid: config.soundcloud.client_id}
                    });
                });
            } else {
                return res.render('index', {layout:false,locals:{
                    version:config.version,
                    title: 'Champions of the World',
                    description:'Flag WebGL',
                    queue : JSON.stringify(tweets),
                    host : config.host,
                    hashtag: config.hashtag,
                    scid: config.soundcloud.client_id}
                });
            }
        });
	}

    api.updateItem = function(req, res) {

        Tweet.update({_id: req.params.id}, {queued : false}, function(err ,tweet) {
            console.log('UPDATED', err, tweet);
        });
    }

	api.canvas = function(req, res) {
		res.redirect('/');
	}
	return api;
}