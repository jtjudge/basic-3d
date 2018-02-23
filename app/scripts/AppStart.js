
window.onload = main;

function main() {

  // Canvas
  var container = document.getElementById("container");
  var WIDTH = window.innerWidth - 20;
  var HEIGHT = window.innerHeight - 20;

  // Camera attributes
  var VIEW_ANGLE = 45;
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1;
  var FAR = 10000;

  // Create workspace scene
  var renderer = new THREE.WebGLRenderer();
  var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  var scene = new THREE.Scene();
  scene.add(camera);
  renderer.setSize(WIDTH, HEIGHT);
  container.appendChild(renderer.domElement);

  // Set up workspace camera
  camera.position.set(150, 100, 150);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Initialize input handling
  InputHandling.init();

  // Set window resize event listener
  InputHandling.register({
    onresize: function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
    }
  });

  // Initialize camera controls
  CameraControls.init(camera);

  // Initialize geometry
  Geometry.init(scene);

  // Create HUD scene
  var hudRenderer = new THREE.WebGLRenderer({ alpha: true });
  var hudCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  var hudScene = new THREE.Scene();
  hudScene.add(hudCamera);
  hudRenderer.setSize(WIDTH / 8, HEIGHT / 8);
  hudRenderer.domElement.style.position = "absolute";
  hudRenderer.domElement.style.bottom = "0";
  hudRenderer.domElement.style.left = "0";
  container.style.position = "relative";
  container.appendChild(hudRenderer.domElement);

  // Set up HUD camera
  hudCamera.position.set(0, 0, 1);
  hudCamera.lookAt(new THREE.Vector3(0, 0, 0));

  // Create axis in HUD
  var axis = new THREE.AxesHelper(0.35);
  hudScene.add(axis);

  // Create grid in workspace
  var grid = new THREE.GridHelper(100, 10);
  scene.add(grid);

  // Initialize remaining modules
  GeometryCreation.init(camera, scene, renderer);
  GeometrySelection.init(camera, renderer);

  // Begin update loop
  function update() {
    InputHandling.update();
    axis.setRotationFromMatrix(camera.matrixWorldInverse);
    renderer.render(scene, camera);
    hudRenderer.render(hudScene, hudCamera);
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}