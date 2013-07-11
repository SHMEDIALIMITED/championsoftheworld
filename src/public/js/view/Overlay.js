/**
 *  Overlay Class
 *  
 */

define([
	'backbone'],

	function(Backbone) {

		return Backbone.View.extend({

			el : '#overlay',

			events: {
				'change form select' : 'onCountrySelected',
				'click .close-btn' : 'hide'
			},

			onCountrySelected : function(e){

				
				var $tweeter = this.$el.find('#tweeter');
				$tweeter.show();
				$tweeter.find('iframe').remove();
				
	            var tweetBtn = $('<a></a>')
		        .addClass('twitter-share-button')
		        .attr('href', 'http://twitter.com/share')
		        .attr('data-url', this.options.host)
		        .attr('data-text', e.currentTarget.value)
		        .attr('data-hashtags', this.options.hashtag)
		        .attr('data-size', 'large')
		        .attr('data-count', 'none');
		       
		        twttr.events.bind('tweet', _.bind(function(){
		        	this.hide();
		        }, this));

				$tweeter.append(tweetBtn);
		        twttr.widgets.load(tweetBtn.html());
			},

			initialize: function(options) {
				var $option;
				var $select = this.$el.find('select');

				// Add initial label
				$option = $('<option>Select a country</option>');
				$option.attr('value', 'false');
				$select.append($option);

				_.each(options.collection, function(country) {
					$option = $('<option>' + country + '</option>');
					$option.attr('value', country);
					$select.append($option);
				}, this);
			},

			_addOption:function() {

			},

			show : function() {
				this.$el.find('#tweeter').hide();
				$('#overlay').fadeIn('fast');
			},

			hide: function() {
				$('#overlay').fadeOut('slow');	      
			}

		});
	});