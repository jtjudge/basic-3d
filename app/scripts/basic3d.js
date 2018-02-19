window.onload = main;

function main() {

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

  // Create HUD
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
  hudCamera.position.set(0, 0, 1);
  hudCamera.lookAt(new THREE.Vector3(0, 0, 0));

  // Initialize camera controls
  var controller = addControls(camera);


  // Initialize vertex placement
  var MAX_POINTS = 500;
  var geometry = new THREE.BufferGeometry();
  var positions = new Float32Array(MAX_POINTS * 3);
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  var count = {
    c: 0
  };
  var material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 2
  });
  line = new THREE.Line(geometry, material);
  scene.add(line);

  // Event listeners
  document.onkeydown = controller.keyDown;
  document.onkeyup = function(event){
    controller.keyUp(event);
    line.geometry.attributes.position.needsUpdate = true;
  }
  document.onmousedown = function(event) {
    controller.mouseDown(event);
    var rect = container.getBoundingClientRect();
    controller.placePoint(event, rect, positions, count, scene);
    line.geometry.setDrawRange(0, count.c);
    line.geometry.attributes.position.needsUpdate = true;
  }
  document.onmouseup = controller.mouseUp;
  document.onmousemove = function(event) {
    var rect = container.getBoundingClientRect();
    var coords = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    controller.mouseMove(coords);
  };
  // Window resize event
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
  }, false);

  // Create axis in HUD
  var axis = new THREE.AxesHelper(0.35);
  hudScene.add(axis);

  // Create grid in workspace
  var grid = new THREE.GridHelper(100, 10);
  grid.name = 'grid';
  scene.add(grid);

  function update() {
    controller.update();
    axis.setRotationFromMatrix(camera.matrixWorldInverse);
    renderer.render(scene, camera);
    hudRenderer.render(hudScene, hudCamera);
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
