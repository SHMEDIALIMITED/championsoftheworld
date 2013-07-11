/**
 * FlagFallback Class
 * Servers static images instead of animated flags 
 */

define(
	
	['backbone'], 
	
	function(Backbone) {

		var basePath;

		return Backbone.View.extend({

			el: '#container',

			initialize : function(options) {
				basePath = options.basePath;
			},

			loadTexture : function(url) {
				$img = $('<img/>');
				$img.attr('src', basePath + url);
				$img.load(_.bind(this._onImageLoaded, this));
				this.$el.empty().append($img)
			},

			resize: function() {
				var ratio = this.$el.width() / this.$el.height()
				if(ratio > 1) {
					// Landscape Ratio
					console.log('HERE')
					this.$el.find('img').addClass('fallback-landscape');
					this.$el.find('img').removeClass('fallback-portrait');
				} else {
					// Portrait Ratio
					this.$el.find('img').addClass('fallback-portrait');
					this.$el.find('img').removeClass('fallback-landscape');
				}
			},

			_onImageLoaded: function(e) {
				this.resize();
			}

		});

	});