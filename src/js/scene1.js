var container, stats
var camera, scene, renderer
var controls, group

let water
let lastTime = (new Date()).getTime();

// HELP

init()
animate()

function init() {
	container = document.createElement('div')
	document.body.appendChild(container)
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 30000)
	// (left/right rotation, up/down rotation,zoom)
	camera.position.set( 2000, 750, 200 );
	var controls = new THREE.OrbitControls(camera)
	scene = new THREE.Scene()

	// Skydome
	renderer = new THREE.CanvasRenderer()
	renderer.setClearColor(0xf0f0f0)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	container.appendChild(renderer.domElement)

	var skyGeo = new THREE.SphereGeometry(25000, 50, 50);		// Create a sphere
	var skyLoader = new THREE.TextureLoader();
	var skyMtl = new THREE.MeshPhongMaterial({							// Set the image and overdraw (to prevent extra lines being drawn)
        map: skyLoader.load("src/img/sky-big.jpg"), overdraw: 0.5	// Note: not sure if we can use this image
	});
	var sky = new THREE.Mesh(skyGeo, skyMtl);								// Create sky mesh from geometry and material
  sky.material.side = THREE.DoubleSide;											// Make sure we see texture from inside and not the outside
  scene.add(sky);

	container = document.getElementById('container');
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	controls.enablePan = false;
	controls.minDistance = 1000.0;
	controls.maxDistance = 5000.0;
	controls.target.set( 0, 500, 0 );
	scene.add( new THREE.AmbientLight( 0xFFFFFF ) );

	// Light
	var light = new THREE.DirectionalLight( 0x222222, 2);
	light.position.set( - 1, 1, - 1 );
	scene.add( light );

	var parameters = {
		width: 2000,
		height: 2000,
		widthSegments: 250,
		heightSegments: 250,
		depth: 1500,
		param: 4,
		filterparam: 1
	};

	ocean = new THREE.Ocean(renderer, camera, scene, {
		USE_HALF_FLOAT : true,
		INITIAL_SIZE : 256.0,
		INITIAL_WIND : [10.0, 10.0],
		INITIAL_CHOPPINESS : 0.5,
		CLEAR_COLOR : [1.0, 1.0, 1.0, 0.0],
		GEOMETRY_ORIGIN : [-256, -256],
		SUN_DIRECTION : [-1.0, 1.0, 1.0],
		OCEAN_COLOR: new THREE.Vector3(0.004, 0.016, 0.047),
		SKY_COLOR: new THREE.Vector3(3.2, 9.6, 12.8),
		EXPOSURE : 0.35,
		GEOMETRY_RESOLUTION: 512,
		GEOMETRY_SIZE : 2048,
		RESOLUTION : 1024
	})
	ocean.materialOcean.uniforms.u_projectionMatrix = { value: camera.projectionMatrix };
	ocean.materialOcean.uniforms.u_viewMatrix = { value: camera.matrixWorldInverse };
	ocean.materialOcean.uniforms.u_cameraPosition = { value: camera.position };
	scene.add(ocean.oceanMesh);



	// TODO: Add island
	var geometry = new THREE.PlaneGeometry(1500, 1500)
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));

	var grassTex = THREE.ImageUtils.loadTexture('src/img/grasslight-big.jpg');
  grassTex.wrapS = THREE.RepeatWrapping;
  grassTex.wrapT = THREE.RepeatWrapping;
  grassTex.repeat.x = 16;
  grassTex.repeat.y = 16;

  var material = new THREE.MeshLambertMaterial( { color: 0x00ff00, wireframe:false, side:THREE.DoubleSide, map:grassTex } );
  // generateHeight(worldWidth, smoothinFactor, boundaryHeight, treeNumber);

	let island = new THREE.Mesh( geometry, material );
	//scene.add(island);
}

function update() {
	var currentTime = new Date().getTime();
		ocean.deltaTime = (currentTime - lastTime) / 1000 || 0.0;
		lastTime = currentTime;
		ocean.render(ocean.deltaTime);
		ocean.overrideMaterial = ocean.materialOcean;
		if (ocean.changed) {
			ocean.materialOcean.uniforms.u_size.value = ocean.size;
			ocean.materialOcean.uniforms.u_sunDirection.value.set( ocean.sunDirectionX, ocean.sunDirectionY, ocean.sunDirectionZ );
			ocean.materialOcean.uniforms.u_exposure.value = ocean.exposure;
			ocean.changed = false;
		}
		ocean.materialOcean.uniforms.u_normalMap.value = ocean.normalMapFramebuffer.texture;
		ocean.materialOcean.uniforms.u_displacementMap.value = ocean.displacementMapFramebuffer.texture;
		ocean.materialOcean.uniforms.u_projectionMatrix.value = camera.projectionMatrix;
		ocean.materialOcean.uniforms.u_viewMatrix.value = camera.matrixWorldInverse;
		ocean.materialOcean.uniforms.u_cameraPosition.value = camera.position;
		ocean.materialOcean.depthTest = true;
		//this.ms_Scene.__lights[1].position.x = this.ms_Scene.__lights[1].position.x + 0.01;
		//controls.update();
}

function animate() {
	requestAnimationFrame(animate)
	render()
}

function render() {
	update()
	renderer.render( scene, camera );
}
