let camera, scene, renderer, container

init()
animate()

function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container = document.getElementById('container')
	container.appendChild(renderer.domElement);

}

function animate() {
	requestAnimationFrame(animate)
	render()
}

function render() {
	renderer.render(scene, camera);
}
