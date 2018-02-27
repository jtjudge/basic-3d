
Basic3D.loadModule("Scene", function (InputHandling) {

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

  var container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  // Set up workspace camera
  camera.position.set(150, 100, 150);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Create grid in workspace
  scene.add(new THREE.GridHelper(100, 10));

  // Add lighting
  scene.add(new THREE.AmbientLight(0x212223));

  // Axis helper
  var xAxis, yAxis, zAxis;

  var geometry, material;
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
  geometry.vertices.push(new THREE.Vector3(1000, 0, 0));
  material = new THREE.LineBasicMaterial({
    color: 0xff0000
  });

  xAxis = new THREE.Line(geometry, material);

  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, -1000, 0));
  geometry.vertices.push(new THREE.Vector3(0, 1000, 0));
  material = new THREE.LineBasicMaterial({
    color: 0x00ff00
  });

  yAxis = new THREE.Line(geometry, material);

  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, -1000));
  geometry.vertices.push(new THREE.Vector3(0, 0, 1000));
  material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

  zAxis = new THREE.Line(geometry, material);

  InputHandling.register({
    onmode: function (input) {
      if(input.mode === "EDIT") {
        scene.remove(xAxis);
        scene.remove(yAxis);
        scene.remove(zAxis);
      }
    },
    onupdate: function(input) {
      renderer.render(scene, camera);
    },
    onresize: function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
    }
  });

  return {
    camera: function() {
      return camera;
    },
    add: function (obj) {
      scene.add(obj);
    },
    remove: function (obj) {
      scene.remove(obj);
    },
    intersectObjects: function (input, objects) {
      var mouse = new THREE.Vector3(
        (input.coords.x2 / renderer.getSize().width) * 2 - 1,
        -(input.coords.y2 / renderer.getSize().height) * 2 + 1,
        0.5
      );
      var caster = new THREE.Raycaster();
      caster.setFromCamera(mouse, camera);
      return caster.intersectObjects(objects);
    },
    intersectPlane: function (input, plane) {
      var mouse = new THREE.Vector2(
        (input.coords.x2 / renderer.getSize().width) * 2 - 1,
        -(input.coords.y2 / renderer.getSize().height) * 2 + 1
      );
      var caster = new THREE.Raycaster();
      caster.setFromCamera(mouse, camera);
      return caster.ray.intersectPlane(plane);
    },
    showX: function (pos) {
      scene.remove(xAxis, yAxis, zAxis);
      xAxis.position.copy(pos);
      scene.add(xAxis);
    },
    showY: function (pos) {
      scene.remove(xAxis, yAxis, zAxis);
      yAxis.position.copy(pos);
      scene.add(yAxis);
    },
    showZ: function (pos) {
      scene.remove(xAxis, yAxis, zAxis);
      zAxis.position.copy(pos);
      scene.add(zAxis);
    }
  };

});