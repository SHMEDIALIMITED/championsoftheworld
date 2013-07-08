require.config({
	'paths': {
		'jquery': 'libs/jquery-1.8.3.min',
		'backbone': 'libs/backbone-min',
		'underscore': 'libs/underscore-min',
		'webgl' : 'webgl',
		'three' : 'Three',
		'raf' : 'RAF',
		'countrymodel' : 'CountryModel'

	},
 
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},

		'three': {
			exports: 'THREE'
		},

		'raf' : {
			exports : 'requestAnimFrame'
		}	
	}
});
 
require([
	'app', 
	'jquery',
], function(App, $) {
	$(document).ready(function() {
		App.init();
	});
});