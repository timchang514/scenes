let camera, controls, scene, renderer
let group, particle, earth

init()
animate()

function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000) // fov, aspect ratio, near plane, far plane
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
		group.add(earth)
	})

	makeStars()
}

function animate() {
	requestAnimationFrame(animate)
	earth.rotation.y += 0.004
	render()
}

function render() {
	renderer.render( scene, camera );
}

function makeStars() {
	var PI2 = Math.PI * 2
	program = function (context) {
		let glowSize = 30;
		let radius = 0.15;
		let hue = 50, sat = 100, lum = 100

		context.beginPath();
		context.arc(0, 0, radius, 0, PI2, true);
		context.fill();
		context.lineWidth = 0.02;

		for (let i = 0; i < glowSize; i++) {
			context.beginPath();
			context.arc(0,0,radius,0,PI2,true)
			sat -= 100/glowSize;
			lum -= 100/glowSize;
			context.strokeStyle = "hsl(" + hue + "," + sat + "%," + lum + "%)"	// Eventually link radius and hue to actual radius of star
			context.stroke()
			radius+= 0.009
		}

	};

	group = new THREE.Group();
	scene.add(group);

	for (var i = 0;i < 1000; i++){
		material = new THREE.SpriteCanvasMaterial({
			color: 0xFFFFFF,
			program: program
		});

		// particle = new THREE.Sprite(material);
		// particle.position.x = Math.random() * 4000 - 2000;
		// particle.position.y = Math.random() * 4000 - 2000;
		// particle.position.z = Math.random() * 4000 - 2000;
		//group.add(particle);
	}

	let rawFile = new XMLHttpRequest()
	let csv;
  rawFile.open("GET", "src/hygdata_small.csv", true);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
							//csv = rawFile.responseText.split("\n")
							let stars = $.csv.toObjects(rawFile.responseText)
							for (let i = 0; i < stars.length; i++) {
								let star = stars[i]
								particle = new THREE.Sprite(material);
								particle.position.x = star.x / 20
								particle.position.y = star.y / 20
								particle.position.z = star.z / 20
								console.log('added star')
								group.add(particle)
							}
          }
      }
  }
  rawFile.send(null)
}
