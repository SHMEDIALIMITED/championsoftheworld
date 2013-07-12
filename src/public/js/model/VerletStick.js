/**
 * VerletStick
 */

define(	[],

		function() {
			
			var VerletStick = function(a, b) {

				var dx = a.x - b.x;
	      		var dy = a.y - b.y;
				
				this.length = Math.sqrt(dx * dx + dy * dy);
				this.a = a;
				this.b = b;

			}

			VerletStick.prototype.update = function() {
				var a = this.a
				var b = this.b;
				var dx = b.x - a.x;
	          	var dy = b.y - a.y;
	          	var dist = Math.sqrt(dx * dx + dy * dy);
	          
	          	var diff = this.length - dist;
	          	
	          	
	          	var offsetX = (diff * dx / dist) / 2;
	          	var offsetY = (diff * dy / dist) / 2;
		  		
		  		if(!a.fixed) {
		  			a.x -= offsetX;	
		  			a.y -= offsetY;
		  		}
		  		
				
		  		if(!b.fixed) {
		  			b.x += offsetX;	
		  			b.y += offsetY;
		  		}
				
				
		  		

		  		// this.set('x', (a.get('x') + b.get('x')) * 0.5);
		  		// this.set('y', (a.get('y') + b.get('y')) * 0.5);
		    //   	this.set('rotation', (Math.atan2((b.get('x') -  a.get('x')) , (a.get('y') - b.get('y') ) )* 180 / Math.PI + 90));
		      
		
		    //     this._diff = diff;
			}

			return VerletStick;
			
		});