define([ 
	'router',
	'backbone',
	'countrymodel',
	'webgl'

	], function(
		Router, 
		Backbone, 
		CountryModel,
		WebGL) {

	var router;
	var countries;
	var socket;
	var webGL;

	console.log('GL', WebGL )

	return {
		init: function() {
			router = new Router();
			Backbone.history.start();

			countries = new CountryModel();

			socket = io.connect('http://localhost');

			webGL = new WebGL();
			webGL.loadTexture('img/webgl/England.jpg');
			$(window).resize(function() {
				webGL.resize();
		 	});
		 	webGL.resize();
		}
	}
})