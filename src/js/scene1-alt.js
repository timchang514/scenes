/*
 * Adapted from the following:
 * "Seascape" by Alexander Alekseev aka TDM - 2014
 * License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * Contact: tdmaav@gmail.com
 */

// init camera, scene, renderer
var scene, camera, controls, renderer, clock
var tuniform, water
var lastX, lastY

init()
animate()

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, 400/300, 0.1, 1000);
	camera.position.z = 50;
	camera.position.y = 130;

	//controls = new THREE.OrbitControls(camera)
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xc4c4c4);
	renderer.setSize(400, 300);
	document.body.appendChild(renderer.domElement);
	clock = new THREE.Clock();

	lastX = renderer.domElement.getBoundingClientRect().left
	lastY = renderer.domElement.getBoundingClientRect().top

	tuniform = {
		iGlobalTime: {
			type: 'f',
			value: 0.1
		},
		iResolution: {
			type: 'v2',
			value: new THREE.Vector2()
		},
		iMouse: {
			type: 'v4',
			value: new THREE.Vector2(0.0,0.0)
		}
	};

	var canvas = renderer.domElement;
	var rect = canvas.getBoundingClientRect();

	// Mouse position in - 1 to 1
	renderer.domElement.addEventListener('mousedown', function(e) {
		tuniform.iMouse.value.x = (e.clientX - rect.left) / 400 * 2 - 1;
		tuniform.iMouse.value.y = (e.clientY - rect.top) / 300 * -2 + 1;
	});
	renderer.domElement.addEventListener('mouseup', function(e) {
		tuniform.iMouse.value.x = (e.clientX - rect.left) / 400 * 2 - 1;
		tuniform.iMouse.value.y = (e.clientY - rect.top) / 300 * -2 + 1;
	});

	// resize canvas function
	window.addEventListener('resize',function() {
		camera.aspect = 400 / 300;
		camera.updateProjectionMatrix();
		renderer.setSize(400, 300);
	});

	tuniform.iResolution.value.x = 400;
	tuniform.iResolution.value.y = 300;
	// Create Plane
	var material = new THREE.ShaderMaterial({
		uniforms: tuniform,
		vertexShader: document.getElementById('vertex-shader').textContent,
		fragmentShader: document.getElementById('fragment-shader').textContent
	});
	water = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(400, 300, 40), material
	);
	scene.add(water);
}

function animate() {
	requestAnimationFrame(animate)
	render()
}

// draw animation
function render(time) {
	tuniform.iGlobalTime.value += clock.getDelta();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
//render();
