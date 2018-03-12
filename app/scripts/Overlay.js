
Basic3D.loadModule("Overlay", function (Input, Scene, Menu) {

  var renderer, width, height, camera, scene, axis, axisVisible, display;

  function setup() {
    width = window.innerHeight / 8;
    height = window.innerHeight / 8;
    // Create HUD scene
    renderer = new THREE.WebGLRenderer({ alpha: true });
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    scene = new THREE.Scene();
    scene.add(camera);
    renderer.setSize(width, height);
    // Add to DOM
    Scene.addLayer(renderer.domElement, { bottom: 10, left: 10 });
    // Set up HUD camera
    camera.position.set(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // Create axis helper
    axis = new THREE.AxesHelper(0.35);
    scene.add(axis);
    axisVisible = true;
  }

  function displayMode() {
    if(display) display.hide();
    display = new Menu();
    display.setClass("menu-transparent");
    var text = document.createElement("div");
    text.className = "notification";
    text.innerHTML = Input.mode();
    display.addItem(text);
    display.show({ top: 0, left: 0 });
  }

  setup();
  displayMode();

  Input.register({
    onresize: function () {
      width = window.innerHeight / 8;
      height = window.innerHeight / 8;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    },
    onmode: displayMode
  });

  return {
    update: function () {
      axis.setRotationFromMatrix(Scene.camera().matrixWorldInverse);
      renderer.render(scene, camera);
    },
    toggle: function () {
      axisVisible = !axisVisible;
      if (axisVisible) {
        scene.add(axis);
      } else {
        scene.remove(axis);
      }
    }
  };

});

Basic3D.loadScript("ToggleAxisHelper", function (Overlay) {
  return Overlay.toggle;
});