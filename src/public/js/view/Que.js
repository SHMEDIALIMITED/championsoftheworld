/**
 * Que View Class
 * Displays upcomming tweets that will change flag.
 */

define(
	[''], 

	function() {

		return Backbone.View.extend({

			el : '#que',

			initialize: function(){
				this.collection.on('add', this.render);
				this.collection.on('remove', this.render);
			},

			render: function(obj) {
				console.log(obj);
			}



		});
	});