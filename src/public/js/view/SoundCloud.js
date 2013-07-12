/**
 * Sound Cloud 
 * Wrapper that is no view bat can be extended to become one 
 * Fades a sound st start and stop positions passed to play method
 */

define(
	
	['backbone',
	'soundcloud'],
	
	function(Backbone){

		var sound;

		return Backbone.View.extend({

			initialize : function(options) {
				SC.initialize({
			  		client_id: options.client_id
				});
			},

			load : function(id, cb) {
				SC.stream(id, function(track){
					sound = track; 
					sound.load({ onload : function() {  	
					  	if(cb) cb();
					}});						
				});
			},

			play: function(start, end) {

				if(!sound || !sound.loaded) return;
				sound.setPosition(start)
				sound.setVolume(0);
				sound.play();

				this._fadeInSound(5);

				sound.onPosition(end, _.bind(function() {
					this._fadeOutSound(5);
				}), this);
			},

			stop: function() {
				if(!sound.loaded) return;
				sound.stop();
			},


			_fadeInSound: function(amount) {
				s = sound;
				var vol = s.volume;
				if (vol == 100) return false;

				s.setVolume(Math.min(100,vol+amount));
				
				setTimeout(_.bind(function(){
					this._fadeInSound(amount);
				}, this),20);
			},

			_fadeOutSound: function(amount) {
				var s = sound;
				var vol = s.volume;
				if (vol == 0) {
					return false;
					s.stop();
				}
				s.setVolume(Math.max(0,vol-amount));
				setTimeout(_.bind(function(){
					this._fadeOutSound(amount);
				}),20);
			}

		})

	});