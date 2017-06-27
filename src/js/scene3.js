let camera, controls, scene, renderer
let group, particle, earth

init()
animate()

function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500) // fov, aspect ratio, near plane, far plane
	scene = new THREE.Scene()
	renderer = new THREE.CanvasRenderer()
	controls = new THREE.OrbitControls(camera, renderer.domElements)

	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.position.z = 5
	document.body.appendChild(renderer.domElement)

	// earth
	let loader = new THREE.TextureLoader();
	loader.load('src/img/earth_atmos_4096.jpg', function(texture) {
		let geometry = new THREE.SphereGeometry(5, 20, 20)
		let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5})
		earth = new THREE.Mesh(geometry, material)
		earth.position.z = -15
		earth.rotation.x = 0.4101
		earth.rotation.y = 0
		group.add(earth)
	})

	makeStars()
}

function animate() {
	requestAnimationFrame(animate)
	try {
		earth.rotation.y += 0.004
	} catch(e) {

	}
	render()
}

function render() {
	renderer.render( scene, camera );
}

function makeStars() {
	var PI2 = Math.PI * 2
	program = function (context) {
		let glowSize = 0;
		let radius = 0.15;
		let hue = 50, sat = 100, lum = 100

		context.beginPath();
		context.arc(0, 0, radius, 0, PI2, true);
		context.fill();
		context.lineWidth = 0.02;

		for (let i = 0; i < glowSize; i++) {
			context.beginPath();
			sat -= 100/glowSize;
			lum -= 100/glowSize;
			context.strokeStyle = "hsl(" + hue + "," + sat + "%," + lum + "%)"	// Eventually link radius and hue to actual radius of star
			context.arc(0,0,radius,0,PI2,true)
			context.stroke()
			radius+= 0.009
		}
	};

	group = new THREE.Group();
	scene.add(group);
	material = new THREE.SpriteCanvasMaterial({
		color: 0xFFFFFF,
		program: program
	});

	let counter = 0;
	Papa.parse("src/hygdata_v3.csv", {
		download: true,
		step: function(row) {
			if (counter % 1 === 0) {
				particle = new THREE.Sprite(material);
				let colorindex = row.data[0][16]
				let rgb = bvtorgb(colorindex)
				material = new THREE.SpriteCanvasMaterial({
					color: new THREE.Color(rgb[0], rgb[1], rgb[2]),
					program: program
				});
				particle.position.x = row.data[0][17] * 10
				particle.position.y = row.data[0][18] * 10
				particle.position.z = row.data[0][19] * 10
				if (particle.position.x && particle.position.y && particle.position.z) {
					group.add(particle)
				}
			}
			counter++
		},
		complete: function() {
			console.log("all done")
		}
	})
}

// Adapted from https://stackoverflow.com/questions/21977786/star-b-v-color-index-to-apparent-rgb-color
// Turn the star's color index to an RGB value
function bvtorgb(bv) {
	let r = 0.0, g = 0.0, b = 0.0
	if (bv < -0.40) {
		bv = -0.40
	}
  if (bv > 2.00) {
		bv = 2.00
	}
  if (-0.40 <= bv < 0.00) {
		t = (bv+0.40)/(0.00+0.40)
		r = 0.61+(0.11*t)+(0.1*t*t)
	} else if (0.00 <= bv < 0.40) {
		t = (bv - 0.00) / (0.40 - 0.00)
		r = 0.83 + (0.17 * t)
	} else if (0.40 <= bv < 2.10) {
		t = (bv - 0.40) / (2.10 - 0.40)
		r = 1.00
	}
  if (-0.40 <= bv < 0.00) {
		t = (bv + 0.40) / (0.00 + 0.40)
		g = 0.70 + (0.07 * t) + (0.1 * t * t)
	} else if (0.00 <= bv <0.40) {
		t = (bv - 0.00) / (0.40 - 0.00)
		g = 0.87 + (0.11 * t)
	} else if (0.40 <= bv < 1.60) {
		t = (bv - 0.40) / (1.60 - 0.40)
		g = 0.98 - (0.16 * t)
	} else if (1.60 <= bv<2.00) {
		t = (bv - 1.60) / (2.00 - 1.60)
		g = 0.82 - (0.5 * t * t)
	}
  if (-0.40 <= bv < 0.40) {
		t = (bv + 0.40) / (0.40 + 0.40)
		b = 1.00
	} else if (0.40 <= bv < 1.50) {
		t = (bv - 0.40) / (1.50 - 0.40)
		b = 1.00 - (0.47 * t) + (0.1 * t * t)
	} else if (1.50 <= bv < 1.94) {
		t = (bv - 1.50) / (1.94 - 1.50)
		b = 0.63 - (0.6 * t * t)
	}
  return [r, g, b]
}
