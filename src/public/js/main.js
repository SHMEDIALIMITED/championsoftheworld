require.config({
	'paths': {
		'jquery': 'libs/jquery-1.8.3.min',
		'backbone': 'libs/backbone-min',
		'underscore': 'libs/underscore-min',
		'three' : 'libs/Three',
		'raf' : 'libs/RAF',
		'signal' : 'libs/signals.min'

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

	var app;

	$(function() {
		app = new App({host:window.COTW_HOST, collection:window.COTW_QUEUE, hashtag:window.COTW_HASHTAG});
	});
});