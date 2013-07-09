define(
	['backbone'], 

	function(Backbone) {

		return Backbone.View.extend({

			el : '#notification',

			initialize: function() {
				this.collection.on('remove', _.bind(this.render, this));
			},

			render : function(obj) {
				this.$el.show();
				var $item = $('<p></p>');
				$item.html(' ' + obj.get('country'));
				
				var $user = $('<span></span>');
				$user.addClass('username');
				$user.html('@' + obj.get('tweet').user.screen_name);
				
		


				$item.prepend($user);
				$item.prepend('Latest tweet: ');
				

				this.$el.empty().append($item);
			}

		})

	});