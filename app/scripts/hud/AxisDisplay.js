
Basic3D.loadModule("AxisDisplay", function (Display, Input, Scene) {

  var renderer, width, height, camera, scene, axis, axisDisplay;

  function setup() {

    width = window.innerHeight / 8;
    height = window.innerHeight / 8;

    // Create HUD scene
    renderer = new THREE.WebGLRenderer({ alpha: true });
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    scene = new THREE.Scene();
    scene.add(camera);
    renderer.setSize(width, height);

    // Set up HUD camera
    camera.position.set(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create axis helper
    axis = new THREE.AxesHelper(0.35);
    scene.add(axis);

    // Add to DOM
    axisDisplay = new Display.Scene(renderer.domElement);
    axisDisplay.align({x: "left", y: "bottom"});
    axisDisplay.show();
  }

  setup();

  Input.register({
    onresize: function () {
      width = window.innerHeight / 8;
      height = window.innerHeight / 8;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  });

  return {
    update: function () {
      axis.setRotationFromMatrix(Scene.camera().matrixWorldInverse);
      renderer.render(scene, camera);
    },
    toggle: axisDisplay.toggle
  };

});

Basic3D.loadScript("ToggleAxisHelper", function (AxisDisplay) {
  return AxisDisplay.toggle;
});
