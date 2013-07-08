(function() {

	var countries = new CountryModel();
	//var socket = io.connect('http://championsoftheworld-dev.herokuapp.com');
	var socket = io.connect('http://localhost');

	socket.on('update', function(data) {
		$('#cue ul').prepend("<li class='cueit' data-twitter='" + JSON.stringify(data) + "'><p>" + data.user.screen_name + "</p></li>");
	});
	
	
	function getCountryForText(text) {
		var i = countries.length;
		var country;
		var regEx;
		while(--i > -1) {
			country = countries[i];
			regEx = '/' + country + '/g'
			if(text.indexOf(country) != -1)
				break;
			else
				country = 'Country not found';
		}
		return country;
	}
	
	setInterval(function() {
		if($('#cue ul li').get(-1)) {
			var item = JSON.parse($('#cue ul li:last').attr('data-twitter'));
			updateWebGL(getCountryForText(item.text))
			console.log(item.text)
			$('#cue ul li:last').remove();
		}
		
	}, 20000);
	
	
	function updateWebGL(country) {
		console.log('UPDATE FLAG', country)
		webGL.loadTexture('img/webgl/' + country + '.jpg');
	}

	var webGL = new WebGL($('#container'));

	updateWebGL('United Kingdom');
	renderCountryOptions();
	function renderCountryOptions(){
		var select = $('#country-selector');
		var option;
		for(var country in countries) {
			//console.log(countries[country])
			option = $('<option>' + countries[country] + '</option>');
			option.attr('value', countries[country]);
			select.append(option);
		}
	}

	$('#tweet-btn').click(function() {
		$('#tweeter').hide();
		$('#overlay').show();
	});


	setTimeout(function(){
		console.log($('#footer a').attr('href'));
	},3000);

	

	$('#overlay form select').bind('change', function() {
		 $('#tweeter').show();
		 $('#tweeter iframe').remove();

		 var val = this.value

		 updateWebGL(this.value);
		 return;
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
		        .attr('data-text', 'KeepOnPushing ' + val)
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

		

		
	});

})();
