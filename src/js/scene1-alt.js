/*
 * Adapted from the following:
 * "Seascape" by Alexander Alekseev aka TDM - 2014
 * License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * Contact: tdmaav@gmail.com
 */

// init camera, scene, renderer
var scene, camera, controls, renderer, clock
var tuniform, water

init()
animate()

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 50;
	camera.position.y = 130;

	controls = new THREE.OrbitControls(camera)
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xc4c4c4);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	clock = new THREE.Clock();

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
			value: new THREE.Vector2()
		}
	};

	// Mouse position in - 1 to 1
	renderer.domElement.addEventListener('mousedown', function(e) {
		var canvas = renderer.domElement;
		var rect = canvas.getBoundingClientRect();
		tuniform.iMouse.value.x = (e.clientX - rect.left) / window.innerWidth * 2 - 1;
		tuniform.iMouse.value.y = (e.clientY - rect.top) / window.innerHeight * -2 + 1;
	});
	renderer.domElement.addEventListener('mouseup', function(e) {
		var canvas = renderer.domElement;
		var rect = canvas.getBoundingClientRect();
		tuniform.iMouse.value.z = (e.clientX - rect.left) / window.innerWidth * 2 - 1;
		tuniform.iMouse.value.w = (e.clientY - rect.top) / window.innerHeight * -2 + 1;
	});
	// resize canvas function
	window.addEventListener('resize',function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	tuniform.iResolution.value.x = window.innerWidth;
	tuniform.iResolution.value.y = window.innerHeight;
	// Create Plane
	var material = new THREE.ShaderMaterial({
		uniforms: tuniform,
		vertexShader: document.getElementById('vertex-shader').textContent,
		fragmentShader: document.getElementById('fragment-shader').textContent
	});
	water = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 40), material
	);
	// water = new THREE.Mesh(
	// 	new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 40)
	// )
	scene.add(water);
}

function animate() {
	requestAnimationFrame(animate)
	render()
}

// draw animation
function render(time) {
	tuniform.iGlobalTime.value += clock.getDelta()/2;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
//render();
