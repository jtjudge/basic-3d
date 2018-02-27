
Basic3D.loadModule("Overlay", function (InputHandling, Scene) {

  var WIDTH = window.innerWidth - 20;
  var HEIGHT = window.innerHeight - 20;

  // Camera attributes
  var VIEW_ANGLE = 45;
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1;
  var FAR = 10000;

  // Create HUD scene
  var hudRenderer = new THREE.WebGLRenderer({ alpha: true });
  var hudCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  var hudScene = new THREE.Scene();

  hudScene.add(hudCamera);
  hudRenderer.setSize(WIDTH / 8, HEIGHT / 8);

  hudRenderer.domElement.style.position = "absolute";
  hudRenderer.domElement.style.bottom = "0";
  hudRenderer.domElement.style.left = "0";

  var container = document.getElementById("container");
  container.style.position = "relative";
  container.appendChild(hudRenderer.domElement);

  // Set up HUD camera
  hudCamera.position.set(0, 0, 1);
  hudCamera.lookAt(new THREE.Vector3(0, 0, 0));

  // Create axis in HUD
  var axis = new THREE.AxesHelper(0.35);
  hudScene.add(axis);

  InputHandling.register({
    onupdate: function (input) {
      axis.setRotationFromMatrix(Scene.camera().matrixWorldInverse);
      hudRenderer.render(hudScene, hudCamera);
    }
  });

  return {};

});