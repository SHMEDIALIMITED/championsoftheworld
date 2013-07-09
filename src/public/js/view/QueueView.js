/**
 * Que View Class
 * Displays upcomming tweets that will change flag.
 */

define(
	['backbone'], 

	function(Backbone) {

		return Backbone.View.extend({

			el : '#queue',

			initialize: function(){
				this.collection.on('add', _.bind(this.addItem, this));
				this.collection.on('remove', _.bind(this.removeItem, this));
			},

			addItem: function(obj) {
				
				
				var $item = $('<li></li>');
				$item.addClass('queueit');
				$item.html(obj.get('tweet').user.screen_name);
				this.$el.find('ul').prepend($item)
			},

			removeItem : function(obj) {
				this.$el.find('ul li:last').remove();	
			}



		});
	});