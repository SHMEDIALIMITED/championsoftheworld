/**
 * Que View Class
 * Displays upcomming tweets that will change flag.
 */

define(
	['backbone'], 

	function(Backbone) {

		var basePath;

		return Backbone.View.extend({

			el : '#queue',

			initialize: function(options){
				basePath = options.basePath;
				this.collection.on('add', _.bind(this.addItem, this));
				this.collection.on('remove', _.bind(this.removeItem, this));
			},

			addItem: function(obj) {
				
				
				var $item = $('<li></li>');
				var $icon = $('<i></i>');
				$item.addClass('queueit');
				$icon.css('background',  'url("' + basePath + obj.get('country') + '.jpg") left no-repeat')
				$icon.css('background-size',  'contain')
				//$item.html('<span>'+obj.get('tweet').user.screen_name+'</span>');
				
				$item.prepend($icon)
				this.$el.find('ul').prepend($item)
			},

			removeItem : function(obj) {
				this.$el.find('ul li:last').remove();	
			},

			renderTest:function(countries) {
				this.$el.find('ul').empty()
				_.each(countries, function(c){
					this.addItem(new Backbone.Model({country:c}));
				}, this)
			}	



		});
	});