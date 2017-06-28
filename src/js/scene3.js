let camera, scene, renderer, container, controls
let points, pointMaterial, pointSystem
let skybox
let wind = new THREE.Vector3(Math.random(0, 50), Math.random(0, 50), Math.random(0, 50))
let pCount = 10000

init()
animate()

function init() {
	//camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 2000)
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 30000)
	camera.position.set( 1500, 750, 200 );

	scene = new THREE.Scene()
//	scene.fog = new THREE.FogExp2( 0x000000, 0.0008 )

	renderer = new THREE.WebGLRenderer()
	renderer.setClearColor(0xf0f0f0)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)

	container = document.getElementById('container')
	container.appendChild(renderer.domElement)

	controls = new THREE.OrbitControls(camera, renderer.domElements)

	scene.add(new THREE.AmbientLight(0xFFFFFF));

	// Initialize particles
	points = new THREE.Geometry()

	var textureLoader = new THREE.TextureLoader()
	var sprite1 = textureLoader.load("src/img/snowflake1.png")
	var sprite2 = textureLoader.load("src/img/snowflake2.png")
	var sprite3 = textureLoader.load("src/img/snowflake3.png")
	var sprite4 = textureLoader.load("src/img/snowflake4.png")
	var sprite5 = textureLoader.load("src/img/snowflake5.png")


	pointMaterial = new THREE.PointsMaterial({
		color: 0xFFFFFF,
		map: sprite2,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
		size: 15
	})
	for (let i = 0; i < pCount; i++) {
		let px, py, pz
		px = Math.random() * 10000 - 5000
		py = Math.random() * 10000 - 5000
		pz = Math.random() * 10000 - 5000
		let point = new THREE.Vector3(px, py, pz)
		point.velocity = new THREE.Vector3(0, -10, 0)
		points.vertices.push(point)
	}
	pointSystem = new THREE.Points(points, pointMaterial)
	scene.add(pointSystem)

	// Create box
	var materials = [];
  var t = [];

  var loader = new THREE.TextureLoader();
  for (var i = 0; i < 6; i++) {
      t[i] = loader.load("src/img/night_2.jpg", render); //2048x256 // changed
      t[i].repeat.x  = 1 / 4;
			t[i].repeat.y = 1 / 3;
			t[i].minFilter = THREE.NearestFilter;
      t[i].generateMipmaps = false;
			t[i].wrapS = t[i].wrapT = THREE.RepeatWrapping
  }
	t[0].offset.x = 2 / 4;
	t[0].offset.y = 1 / 3;
	t[1].offset.x = 0 / 4;
	t[1].offset.y = 1 / 3;
	t[2].offset.x = 1 / 4;
	t[2].offset.y = 2 / 3;
	t[3].offset.x = 1 / 4;
	t[3].offset.y = 0 / 3;
	t[4].offset.x = 1 / 4;
	t[4].offset.y = 1 / 3;
	t[5].offset.x = 3 / 4;
	t[5].offset.y = 1 / 3;
	for (var i = 0; i < 6; i++) {
      materials.push( new THREE.MeshBasicMaterial( { map: t[i], side: THREE.BackSide } ) );
  }

  var skyBox = new THREE.Mesh( new THREE.CubeGeometry(10000, 10000, 10000), materials);
  // skyBox.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, -1 ) );
	// skyBox.material.side = THREE.DoubleSide;
  scene.add( skyBox );
}

function animate() {
	requestAnimationFrame(animate)
	render()
	drawParticles()
}

function render() {
	renderer.render(scene, camera);
}

function drawParticles() {
	for (let i = 0; i < pCount; i++) {
		let point = points.vertices[i]
		point.x += point.velocity.x
		point.y += point.velocity.y
		point.z += point.velocity.z

		point.x += wind.x
		point.y += wind.y
		point.z += wind.z

		let pointThresh = 6000
		if (Math.random() > 0.9) {
			if (Math.abs(point.x) > pointThresh) {
				point.x *= -1
			}
			if (Math.abs(point.y) > pointThresh) {
				point.y *= -1
			}
			if (Math.abs(point.z) > pointThresh) {
				point.z *= -1
			}
		}

		if (Math.random() > 0.95) {
			wind = new THREE.Vector3(Math.random(0, 50), Math.random(0, 50), Math.random(0, 50))
		}
		points.verticesNeedUpdate = true
	}

}
