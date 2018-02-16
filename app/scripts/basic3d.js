window.onload = main;

function main() {
	// Viewport size
	const WIDTH = 800;
	const HEIGHT = 600;

	// Camera attributes.
	const VIEW_ANGLE = 45;
	const ASPECT = WIDTH / HEIGHT;
	const NEAR = 0.1;
	const FAR = 10000;

	const container = document.getElementById("container");
	const renderer = new THREE.WebGLRenderer();
	const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	const scene = new THREE.Scene();
	scene.add(camera);
	renderer.setSize(WIDTH, HEIGHT);
	container.appendChild(renderer.domElement);
	
	const controller = addControls(camera);
	
	// Set up input listeners
	document.onkeydown = controller.keyDown;
	document.onkeyup = controller.keyUp;
	document.onmousedown = controller.mouseDown;
	document.onmouseup = controller.mouseUp;
	document.onmousemove = controller.mouseMove;
	
	// Create grid
	const grid = new THREE.GridHelper(100, 10);
	scene.add(grid);
	
	// Create point light
	const pointLight = new THREE.PointLight(0xFFFFFF);
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	scene.add(pointLight);
	
	function update() {
		controller.update();
		renderer.render(scene, camera);
		requestAnimationFrame(update);
	}
	
	// Start
	requestAnimationFrame(update);	
}