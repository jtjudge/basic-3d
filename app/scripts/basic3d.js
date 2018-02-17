window.onload = main;

function main() {
	// Viewport size
	var WIDTH = 800;
	var HEIGHT = 600;

	// Camera attributes
	var VIEW_ANGLE = 45;
	var ASPECT = WIDTH / HEIGHT;
	var NEAR = 0.1;
	var FAR = 10000;

	var container = document.getElementById("container");
	
	// Create workspace scene
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	var scene = new THREE.Scene();
	scene.add(camera);
	renderer.setSize(WIDTH, HEIGHT);
	container.appendChild(renderer.domElement);
	
	// Create HUD
	var hudRenderer = new THREE.WebGLRenderer({ alpha: true });
	var hudCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	var hudScene = new THREE.Scene();
	hudScene.add(hudCamera);
	hudRenderer.setSize(WIDTH / 8, WIDTH / 8);
	hudRenderer.domElement.style.position = "absolute";
	hudRenderer.domElement.style.bottom = "0";
	hudRenderer.domElement.style.left = "0";
	container.style.position = "relative";
	container.appendChild(hudRenderer.domElement);
	hudCamera.position.set(0, 0, 1);
	hudCamera.lookAt(new THREE.Vector3(0, 0, 0));
	
	// Initialize camera controls
	var controller = addControls(camera);
	document.onkeydown = controller.keyDown;
	document.onkeyup = controller.keyUp;
	document.onmousedown = controller.mouseDown;
	document.onmouseup = controller.mouseUp;
	document.onmousemove = function(event) {
		var rect = container.getBoundingClientRect();
		var coords = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
		controller.mouseMove(coords);
	};
	
	// Create axis in HUD
	var axis = new THREE.AxesHelper(0.35);
	hudScene.add(axis);
	
	// Create grid in workspace
	var grid = new THREE.GridHelper(100, 10);
	scene.add(grid);
	
	function update() {
		controller.update();
		axis.setRotationFromMatrix(camera.matrixWorldInverse);
		renderer.render(scene, camera);
		hudRenderer.render(hudScene, hudCamera);
		requestAnimationFrame(update);
	}
	
	// Start
	requestAnimationFrame(update);	
}