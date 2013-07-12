require.config({
	'paths': {
		'jquery': 'libs/jquery-1.8.3.min',
		'backbone': 'libs/backbone-min',
		'underscore': 'libs/underscore-min',
		'three' : 'libs/three_r58',
		'raf' : 'libs/RAF',
		'soundcloud' : 'http://connect.soundcloud.com/sdk'
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
		},

		'soundcloud': {
			exports : 'SC'
		}	
	}
});
 
require([
	'app', 
	'jquery',
], function(App, $) {

	var app;

	$(function() {
		app = new App({host:window.COTW_HOST, collection:window.COTW_QUEUE, hashtag:window.COTW_HASHTAG, soundcloud: window.SC_ID});
	});
});