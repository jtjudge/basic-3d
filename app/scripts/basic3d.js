
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

	// Add the camera to the scene.
	scene.add(camera);

	// Start the renderer.
	renderer.setSize(WIDTH, HEIGHT);

	// Attach the renderer-supplied
	// DOM element.
	container.appendChild(renderer.domElement);
}