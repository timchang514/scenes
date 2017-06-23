var container, stats
var camera, scene, renderer
var controls, group

var water

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

	var skyGeo = new THREE.SphereGeometry(15000, 50, 50);		// Create a sphere
	var skyLoader = new THREE.TextureLoader();
	var skyMtl = new THREE.MeshPhongMaterial({							// Set the image and overdraw (to prevent extra lines being drawn)
        map: skyLoader.load("src/img/sky-big.jpg"), overdraw: 0.5	// Note: not sure if we can use this image
	});
	var sky = new THREE.Mesh(skyGeo, skyMtl);								// Create sky mesh from geometry and material
  sky.material.side = THREE.BackSide;											// Make sure we see texture from inside and not the outside
  scene.add(sky);
	//scene.fog = new THREE.FogExp2( 0xaabbbb, 0.00001 );

	container = document.getElementById('container');
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	controls.enablePan = false;
	controls.minDistance = 1000.0;
	controls.maxDistance = 5000.0;
	controls.maxPolarAngle = Math.PI * 0.495;
	controls.target.set( 0, 500, 0 );
	scene.add( new THREE.AmbientLight( 0xFFFFFF ) );

	// Light
	var light = new THREE.DirectionalLight( 0x222222, 1 );
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
	var waterNormals = new THREE.TextureLoader().load('examples/textures/waternormals.jpg');
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
	water = new THREE.Water( renderer, camera, scene, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: waterNormals,
		alpha: 	1.0,
		sunDirection: light.position.clone().normalize(),
		sunColor: 0xffffff,
		waterColor: 0x68afb7,
		distortionScale: 200.0,
		fog: scene.fog != undefined
	});
	var mirrorMesh = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( parameters.width * 500, parameters.height * 500 ),
		water.material
	);
	mirrorMesh.add( water );
	mirrorMesh.rotation.x = - Math.PI * 0.5;
	scene.add( mirrorMesh );
}

function animate() {
	requestAnimationFrame(animate)
	render()
}

function render() {
	water.material.uniforms.time.value += 2.0 / 60.0;
	water.render();
	renderer.render( scene, camera );
}
