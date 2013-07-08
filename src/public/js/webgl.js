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

	// set the scene size
	var WIDTH = 400,
	    HEIGHT = 300;
	
	// set some camera attributes
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000000;

	var renderer, camera, scene, mat, light, plane, vertices;


	return Backbone.View.extend({

		el: '#container',

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
			plane = new THREE.Mesh(  new THREE.PlaneGeometry(400,300,100,50), mat);
			plane.rotation.x = Math.PI / 2;	
			scene.add(plane);
			
			// Populate the array of attributes for animtion in update call
			vertices = plane.geometry.vertices;
			for(var v = 0; v < vertices.length; v++) {
				vertices[v].x += 410;
			}

			requestAnimFrame(this.render);
		}, 

		loadTexture : function(url) { 
			mat.map = THREE.ImageUtils.loadTexture(url);
		},

		resize: function() {
			renderer.setSize(this.$el.width(), this.$el.height())
		},

		render: function() {

			var i = vertices.length;
			var v;
			var m = 0.0;


			// Wave Algorythm to push verices around
			while(--i > -1 ) {
				v = vertices[i];
				v.y =  v.x*Math.sin((v.x - (time+v.z/10)*2)*.1) *.1;
				v.y +=  v.x/10*Math.cos((v.x/10 - time)*.2) *1;
				v.y += v.z* Math.cos(v.z - time*.1)*.2;
				v.y += Math.sin(v.z / 2 + time);
				v.y *= v.x * .001;
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

// var WebGL = function($container) {
	
// 	var self = this;

// 	// time elapsed
// 	var time = 0;

// 	// set the scene size
// 	var WIDTH = 400,
// 	    HEIGHT = 300;
	
// 	// set some camera attributes
// 	var VIEW_ANGLE = 45,
// 	    ASPECT = WIDTH / HEIGHT,
// 	    NEAR = 0.1,
// 	    FAR = 10000000;
	
// 	// WEB GL container 

	
// 	// create a WebGL renderer, camera
// 	// and a scene
// 	var renderer = new THREE.WebGLRenderer();
// 	var camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
// 	                                ASPECT,
// 	                                NEAR,
// 	                                FAR  );
// 	var scene = new THREE.Scene();
// 	scene.add(camera);

// 	// the camera starts at 0,0,0 so pull it back
// 	camera.position.z = 300;
// 	camera.position.x = 410;
// 	camera.position.y = -30;
// 	camera.rotation.x = .1
// 	camera.rotation.y = .05//.2// start the renderer
// 	renderer.setSize(WIDTH, HEIGHT);
	
// 	// attach the render-supplied DOM element
// 	$container.append(renderer.domElement);	
	

// 	var mat = new THREE.MeshLambertMaterial({ ambient:0xff0000, reflectivity:0, shading:THREE.SmoothShading});
// 	this.material = mat;
	
// 	var light = new THREE.DirectionalLight(0xDDCCCC, 1);
// 	light.position.z = 100;
// 	scene.add(light);
	

// 	// Flag Plane
// 	var plane = new THREE.Mesh(  new THREE.PlaneGeometry(400,300,100,50), mat);
// 	plane.rotation.x = Math.PI / 2;	
// 	scene.add(plane);
	
// 	// Populate the array of attributes for animtion in update call
// 	var vertices = plane.geometry.vertices;
// 	for(var v = 0; v < vertices.length; v++) {
// 		vertices[v].x += 410;
// 	}
	
	
	
	
		
		
	
// 	// Resize handler for scene and callback hook up
// 	this.resize = function() {
// 		renderer.setSize($('#container').width(), $('#container').height())
// 	}
// 	$(window).resize(function() {
// 		self.resize();
// 	});

// 	// Initial resize
// 	this.resize();


// 	// draw!
// 	function update() {
		
// 		var i = vertices.length;
// 		var v;
// 		var m = 0.0;


// 		// Wave Algorythm to push verices around
// 		while(--i > -1 ) {
// 			v = vertices[i];
// 			v.y =  v.x*Math.sin((v.x - (time+v.z/10)*2)*.1) *.1;
// 			v.y +=  v.x/10*Math.cos((v.x/10 - time)*.2) *1;
// 			v.y += v.z* Math.cos(v.z - time*.1)*.2;
// 			v.y += Math.sin(v.z / 2 + time);
// 			v.y *= v.x * .001;
// 		}

// 		// Update time
// 		time += 0.1;
		
// 		// Ensure shaders get updated
// 		var geometry = plane.geometry;
// 		geometry.verticesNeedUpdate = true;
// 		geometry.dynamic = true;	
// 		geometry.computeFaceNormals();
// 		geometry.verticesNeedUpdate = true;
// 		geometry.elementsNeedUpdate = true;
// 		geometry.morphTargetsNeedUpdate = true;
// 		geometry.uvsNeedUpdate = true;
// 		geometry.normalsNeedUpdate = true;
// 		geometry.colorsNeedUpdate = true;
// 		geometry.tangentsNeedUpdate = true;
// 		geometry.computeVertexNormals();	
		
		
		
// 		renderer.render(scene, camera);
		
// 		requestAnimFrame(update);
// 	}

// 	requestAnimFrame(update);
// };

// // Loads a new texture
// WebGL.prototype.loadTexture = function(url) { 
// 	this.material.map = THREE.ImageUtils.loadTexture(url);
// }
