
window.onload = main;

function main() {
	// Set the scene size.
	const WIDTH = 800;
	const HEIGHT = 600;

	// Set some camera attributes.
	const VIEW_ANGLE = 45;
	const ASPECT = WIDTH / HEIGHT;
	const NEAR = 0.1;
	const FAR = 10000;

	// Get the DOM element to attach to
	const container = document.getElementById("container");

	// Create a WebGL renderer, camera
	// and a scene
	const renderer = new THREE.WebGLRenderer();
	const camera =
		new THREE.PerspectiveCamera(
			VIEW_ANGLE,
			ASPECT,
			NEAR,
			FAR
		);

	const scene = new THREE.Scene();

	// Set initial camera position
	camera.position.x = 150;
	camera.position.y = 100;
	camera.position.z = 150;
	
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	// Add the camera to the scene.
	scene.add(camera);

	// Start the renderer.
	renderer.setSize(WIDTH, HEIGHT);

	// Attach the renderer-supplied
	// DOM element.
	container.appendChild(renderer.domElement);
	
	// Create Grid vars
	const GRID_SIZE = 100;
	const GRID_DIVISIONS = 10;

	// Create Grid
	const grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS);

	// Add Grid to Scene
	scene.add(grid);
	
	// create a point light
	const pointLight =
	  new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	// add to the scene
	scene.add(pointLight);
	
	function update () {
	  // Draw!
	  renderer.render(scene, camera);

	  // Schedule the next frame.
	  requestAnimationFrame(update);
	}

	// Schedule the first frame.
	requestAnimationFrame(update);
	
	// Set up key listener
	window.onkeypress = function(event) {
		cameraControl(camera, 
			String.fromCharCode(event.keyCode));
	};
}