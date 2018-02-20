window.onload = main;

function main() {

  // Initialize input handling
  var inputHandler = initInputHandling();

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

  // Initialize camera controls
  var controller = initCameraControls(camera, inputHandler);

  // Window resize event
  inputHandler.register({
    onresize: function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
    }
  });

  // Create HUD scene
  var hudRenderer = new THREE.WebGLRenderer({
    alpha: true
  });
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
  grid.name = 'grid';
  scene.add(grid);

  // Keep track of the points in the scene
  var verts = [];

  // Initialize vertex placement
  initVertexPlacement(grid, verts, camera, scene, renderer, inputHandler);

  // Initialize vertex selection
  var selector = initVertexSelection(grid, verts, camera, scene, renderer, inputHandler);

  function update() {
    inputHandler.update();
    axis.setRotationFromMatrix(camera.matrixWorldInverse);
    renderer.render(scene, camera);
    hudRenderer.render(hudScene, hudCamera);
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
