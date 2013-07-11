/**
 *  Class WebGL for flag rendering into container element
 *  Constructor takes jQuery container element
 */


define([
	'backbone',
	'three',
	'raf'
	], function(Backbone, THREE, requestAnimFrame) {
	
	var self;

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

	var renderer, camera, scene, mat, light, plane, vertices;

	var mouseX, mouseY, easing = 0.0;

	return Backbone.View.extend({

		el: '#container',

		// events :{
		// 	'mousemove' : 'onMouseMove'
		// },

		initialize : function() {

			self = this;

			renderer = new THREE.WebGLRenderer();
			camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
			                                ASPECT,
			                                NEAR,
			                                FAR  );
			scene = new THREE.Scene();
			scene.add(camera);

			// the camera starts at 0,0,0 so pull it back
			camera.position.z = 300;
			camera.position.x = 410;
			camera.position.y = -30;
			camera.rotation.x = .1
			camera.rotation.y = .05//.2// start the renderer
			renderer.setSize(WIDTH, HEIGHT);
			
			this.$el.append(renderer.domElement);

			mat = new THREE.MeshLambertMaterial({ ambient:0xff0000, reflectivity:0, shading:THREE.SmoothShading});
			this.material = mat;
			
			light = new THREE.DirectionalLight(0xDDCCCC, 1);
			light.position.z = 100;
			scene.add(light);
			

			// Flag Plane
			plane = new THREE.Mesh(  new THREE.PlaneGeometry(400,300,detail*100,25), mat);
			plane.rotation.x = Math.PI / 2;	
			plane.position.x = -20;
			scene.add(plane);
			
			// Populate the array of attributes for animtion in update call
			vertices = plane.geometry.vertices;
			for(var v = 0; v < vertices.length; v++) {
				vertices[v].x += 410;
			}

			requestAnimFrame(_.bind(self.render, this));
		}, 

		loadTexture : function(url) { 
			mat.map = THREE.ImageUtils.loadTexture(url);
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
			// if(easing > 0) {

			// } else {
			// 	easing = 0
			// }
			// easing -= 0.001	
			// camera.position.x = 400 + (mouseX - WIDTH / 2) * 1 * easing;
			// camera.position.y = -30 + (mouseY - HEIGHT / 2) * -1 * easing;
			// camera.lookAt(CENTER)

			var i = vertices.length;
			var v;
			var m = 0.0;


			// // Wave Algorythm to push verices around
			while(--i > -1 ) {
				v = vertices[i];
				v.y =  v.x*Math.sin((v.x - (time+v.z/10)*2)*.1) *.1;
				v.y +=  v.x/10*Math.cos((v.x/10 - time)*.2) *1;
				v.y += v.z* Math.cos(v.z - time*.1)*.2;
				v.y += Math.sin(v.z / 2 + time);
				v.y *=    (.1 + v.x * .001);
			}

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
			
			requestAnimFrame(self.render);
		}
	});
});