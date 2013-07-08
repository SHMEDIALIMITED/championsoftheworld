/**
 *  Overlay Class
 *  
 */

define([
	'backbone',
	'signal'],

	function(Backbone, Signal) {

		return Backbone.View.extend({

			el : '#overlay',

			events: {
				'change form select' : 'onCountrySelected'
			},

			onCountrySelected : function(e){
				$('#tweeter').show();
				// shorten URL and reload Tweet button with correct data attributes 
				$.ajax({
			        url: 'https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/fbsS&key=AIzaSyANFw1rVq_vnIzT4vVOwIw3fF1qHXV7Mjw',
			        type: 'POST',
			        contentType: 'application/json; charset=utf-8',
			        data: '{ longUrl: "' + 'http://hello.com?rand=' + Math.random() +'"}',
			        dataType: 'json',
			        success: function(response) {
			        	console.log(response.id)
			             var tweetBtn = $('<a></a>')
				        .addClass('twitter-share-button')
				        .attr('href', 'http://twitter.com/share')
				        .attr('data-url', response.id)
				        .attr('data-text', 'KeepOnPushing ' + e.currentTarget.value)
				        .attr('data-hashtags', 'KeepOnPushing')
				        .attr('data-size', 'large')
				        .attr('data-count', 'none');
				       
				        twttr.events.bind('tweet', function() {
							$('#overlay').fadeOut('slow');	         	
						});

						$('#tweeter').append(tweetBtn);
				        twttr.widgets.load(tweetBtn.html());			        
			        }
			    });
			},

			initialize: function(options) {
				this.countrySelected = new Signal();
				var $option;
				var $select = this.$el.find('select');
				_.each(options.collection, function(country) {
					$option = $('<option>' + country + '</option>');
					$option.attr('value', country);
					$select.append($option);
				});
			},

			show : function() {
				this.$el.find('#tweeter').hide();
				this.$el.show();
			},

			hide: function() {
				this.$el.hide();
			}

		});
	});