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
	          	var dz = b.z - a.z;
	          	var dist = Math.sqrt(dx * dx + dy * dy + dz*dz);
	          
	          	var diff = this.length - dist;
	          	
	          	// 1.1 is rigid but unstable  
	          	var q = 3 
	          	var offsetX = (diff * dx / dist) / q;
	          	var offsetY = (diff * dy / dist) / q;
	          	var offsetZ = (diff * dz / dist) / q;
		  		

		  		if(!a.fixed) {
		  			a.x -= offsetX;	
		  			a.y -= offsetY;
		  			a.z -= offsetZ;
		  		}
		  		
				
		  		if(!b.fixed) {
		  			b.x += offsetX;	
		  			b.y += offsetY;
		  			b.z += offsetZ;
		  		}
			}

			return VerletStick;
		});