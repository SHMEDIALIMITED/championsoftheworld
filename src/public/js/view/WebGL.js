/**
 *  Class WebGL for flag rendering into container element
 *  Constructor takes jQuery container element
 */


define([
	'backbone',
	'three',
	'raf',
	'model/VerletStick'
	], function(Backbone, THREE, requestAnimFrame, VerletStick) {
	
	var self;

	var basePath;

	var time = 0.0;

	// detail factor
	var detail = 3;

	// set the scene size
	var WIDTH = 400,
	    HEIGHT = 300;
	
	// set some camera attributes
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000000;

	var CENTER = new THREE.Vector3(400,0,0)    

	var renderer, camera, scene, mat, light, plane, vertices, sticks;

	var mouseX, mouseY, easing = 0.0;





 	// Extend THREE.Vector3
 	THREE.Vector3.prototype.update = function() {
		var _x = this.x;
       	var _y = this.y;
       	var _z = this.z;

       	this.x += (_x - this.oldX);
       	this.y += (_y - this.oldY);
       	this.z += (_z - this.oldZ);

       //	this.set({x: _x + _x - this.oldX});
        //this.set({y: _y + _y - this.oldY});

        this.oldX = _x;
        this.oldY = _y;
        this.oldZ = _z;
	}



	return Backbone.View.extend({

		el: '#container',



		// events :{
		// 	'mousemove' : 'onMouseMove'
		// },

		initialize : function(options) {

			basePath = options.basePath;


			self = this;

			renderer =  new THREE.WebGLRenderer();
			camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
			                                ASPECT,
			                                NEAR,
			                                FAR  );
			scene = new THREE.Scene();
			scene.add(camera);



			// the camera starts at 0,0,0 so pull it back
			camera.position.z =350;
			//camera.position.y = 500;
			//camera.rotation.x = -Math.PI / 2;
			//camera.rotation.y = .05//.2// start the renderer
			renderer.setSize(WIDTH, HEIGHT);
			
			this.$el.append(renderer.domElement);

			mat = new THREE.MeshPhongMaterial({ 	ambient:0xff0000, 
													
														//wireframe:true,
													reflectivity:0, 

													shading:THREE.SmoothShading});
			this.material = mat;
			
			light = new THREE.DirectionalLight(0xDDCCCC, 1);
			light.position.z = 2;
			scene.add(light);
			

			var segmentsX = 100;
			var segmentsY = 4;

			// Flag Plane
			plane = new THREE.Mesh(  new THREE.PlaneGeometry(400,300,segmentsX,segmentsY), mat);
			//plane.rotation.x = Math.PI / 8;	
			//plane.position.x = -20;
			scene.add(plane);
			
			// Populate the array of attributes for animtion in update call
			vertices = plane.geometry.vertices;
			

			
			sticks = [];


			// 100 vertices
			// 9 * 9 = 81 sticks horizontal
			// 9 * 9 = 81 sticks vertical
			// 
			var fold = segmentsX + 1;
			var v, prev, n;
			n = 0; 
			for(var i = 0; i < vertices.length; i++) {
				v = vertices[i];
				
				// Fix 
				if(i % fold == 0 || i %fold == fold-1) {
					v.fixed = true;
				}

				v.oldX = v.x;
				v.oldY = v.y;
				v.oldZ = v.z;

				
					if(i % fold == 0) {
						
						
						n++;
						for(var q = 0; q < fold; q++) {
							var a = vertices[q];
							var b = vertices[q + fold];
							addStick(a,b);

						}

						for(var q = 1; q < fold; q++) {
							var a = vertices[q];
							var b = vertices[q + fold];
							
							addStick(a,b)
						}

						for(var q = 0; q < fold-1; q++) {
							var a = vertices[q];
							var b = vertices[q + fold + 1];
							console.log('here')
							addStick(a,b)
						}
					} else {
						
						// add horizontal sticks
						addStick(prev,v)	
					}
					
				

				prev = v;
			}

			console.log(v)

			// add vertical sticks
			// i = 0
			// for(; i< 9) 

			function addStick(a,b) {
				//console.log('addStick');
				sticks.push(new VerletStick(a,b));
			}

			//console.log(sticks)

			this.$el.click(_.bind(function(){
				this.render();
			}, this));

			requestAnimFrame(_.bind(self.render, this));
		}, 

		

		loadTexture : function(url) { 
			mat.map = THREE.ImageUtils.loadTexture(basePath + url);
		},

		resize: function() {
			WIDTH = this.$el.width();
			HEIGHT = this.$el.height();
			renderer.setSize(this.$el.width(), this.$el.height())
		},

		onMouseMove: function(e) {
			// easing = 0.01;
			// mouseX = e.clientX;
			// mouseY = e.clientY;
		},

		render: function() {
			console.log('RENDER')
			// if(easing > 0) {

			// } else {
			// 	easing = 0
			// }
			// easing -= 0.001	
			// camera.position.x = 400 + (mouseX - WIDTH / 2) * 1 * easing;
			// camera.position.y = -30 + (mouseY - HEIGHT / 2) * -1 * easing;
			// camera.lookAt(CENTER)

			// var i = vertices.length;
			// var v;
			// var m = 0.0;
		
			//camera.rotation.x += Math.PI;
			this.updatePhysics();

			// // Wave Algorythm to push verices around
			// while(--i > -1 ) {
			// 	v = vertices[i];
			// 	v.y =  v.x*Math.sin((v.x - (time+v.z/10)*2)*.1) *.1;
			// 	v.y +=  v.x/10*Math.cos((v.x/10 - time)*.2) *1;
			// 	v.y += v.z* Math.cos(v.z - time*.1)*.2;
			// 	v.y += Math.sin(v.z / 2 + time);
			// 	v.y *=    (.1 + v.x * .001);
			// }

			// Update time
			time += 0.1;
			
			// Ensure shaders get updated
			var geometry = plane.geometry;
			geometry.verticesNeedUpdate = true;
			geometry.dynamic = true;	
			geometry.computeFaceNormals();
			geometry.verticesNeedUpdate = true;
			geometry.elementsNeedUpdate = true;
			geometry.morphTargetsNeedUpdate = true;
			geometry.uvsNeedUpdate = true;
			geometry.normalsNeedUpdate = true;
			geometry.colorsNeedUpdate = true;
			geometry.tangentsNeedUpdate = true;
			geometry.computeVertexNormals();	
			
			
			
			renderer.render(scene, camera);
			
			requestAnimFrame(_.bind(this.render, self));
		},

		updatePhysics : function (){
			var points = vertices;
			i = points.length;
			var point;
			

			

			while( --i > -1 ) {
				point = points[i];
				if(point.fixed) continue;
				point.y -= .1 + Math.random();
				point.y += .1 + Math.random();
				point.z -= .1 + Math.random();
				point.z += .1 + Math.random();
				point.x += .1;
				point.update();
			}
			

			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}

			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}

			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			while( --i > -1 ) {
				sticks[i].update();
			}

			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}

			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}

			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}


		}
	});

});