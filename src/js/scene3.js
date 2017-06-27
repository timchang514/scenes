let camera, scene, renderer, container
let points, pointMaterial, pointSystem
let pCount = 2000

init()
animate()

function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 400);
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container = document.getElementById('container')
	container.appendChild(renderer.domElement);

	// Initialize particles
	points = new THREE.Geometry()
	pointMaterial = new THREE.PointsMaterial({
		color: 0xFFFFFF,
		size: 0.2
	})
	for (let i = 0; i < pCount; i++) {
		let px, py, pz
		px = Math.random() * 40 - 20
		py = Math.random() * 40 - 20
		pz = Math.random() * 40 - 20
		let point = new THREE.Vector3(px, py, pz)
		point.velocity = new THREE.Vector3(0, -Math.random(), 0)
		points.vertices.push(point)
	}
	pointSystem = new THREE.Points(points, pointMaterial)
	scene.add(pointSystem)
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

		if (point.x > 200) {

		}
		if (point.y < -100) {
			point.y = 100;
			point.velocity.y = -Math.random()

		}
		if (point.z > 200) {

		}

		points.verticesNeedUpdate = true
	}
}
