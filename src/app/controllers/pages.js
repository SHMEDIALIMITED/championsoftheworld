
module.exports = function(config) {
	var api = {};

	api.index = function(req, res) {
		res.render('index', {layout:false,locals:{
			version:config.version, 
			title: 'Champions of the World', description:'Flag WebGL', 
			fbAppID: config.facebook.clientID}});
	}

	api.canvas = function(req, res) {
		res.redirect('/');
	}
	return api;
}