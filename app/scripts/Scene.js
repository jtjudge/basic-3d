
Basic3D.loadModule("Scene", function (Input) {

  var container, renderer, width, height, camera, scene, axis;

  function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    // Create workspace scene
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    scene = new THREE.Scene();
    scene.add(camera);
    renderer.setSize(width, height);
    // Add to DOM
    addLayer(renderer.domElement, {});
    // Set up workspace camera
    camera.position.set(150, 100, 150);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // Create grid
    scene.add(new THREE.GridHelper(100, 10));
    // Add lighting
    scene.add(new THREE.AmbientLight(0x212223));
  }

  function addLayer(el, pos) {
    el.className += " sub-container";
    if (pos.top !== undefined) el.style.top = pos.top + "px";
    if (pos.bottom !== undefined) el.style.bottom = pos.bottom + "px";
    if (pos.left !== undefined) el.style.left = pos.left + "px";
    if (pos.right !== undefined) el.style.right = pos.right + "px";
    if (container === undefined) {
      container = document.getElementById("container");
    }
    container.appendChild(el);
  }

  function removeLayer(el) {
    el.remove();
  }

  function setAxis(x, y, z, pos) {
    scene.remove(axis);
    var geometry, material;
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-1000 * x, -1000 * y, -1000 * z));
    geometry.vertices.push(new THREE.Vector3(1000 * x, 1000 * y, 1000 * z));
    material = new THREE.LineBasicMaterial({ color: new THREE.Color(x, y, z) });
    axis = new THREE.Line(geometry, material);
    axis.position.copy(pos);
    scene.add(axis);
  }

  setup();

  Input.register({
    onmode: function () {
      if (Input.mode("EDIT")) {
        scene.remove(axis);
      }
    },
    onupdate: function () {
      renderer.render(scene, camera);
    },
    onresize: function () {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  });

  return {
    addLayer: addLayer,
    removeLayer: removeLayer,
    camera: function () {
      return camera;
    },
    add: function (obj) {
      scene.add(obj);
    },
    remove: function (obj) {
      scene.remove(obj);
    },
    intersectObjects: function (objects) {
      var mouse = new THREE.Vector3(
        (Input.coords().x2 / width) * 2 - 1,
        -(Input.coords().y2 / height) * 2 + 1,
        0.5
      );
      var caster = new THREE.Raycaster();
      caster.setFromCamera(mouse, camera);
      return caster.intersectObjects(objects);
    },
    showX: function (pos) {
      setAxis(1, 0, 0, pos);
    },
    showY: function (pos) {
      setAxis(0, 1, 0, pos);
    },
    showZ: function (pos) {
      setAxis(0, 0, 1, pos);
    },
    getMovementOnXZ: function () {
      var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
      var mouse1 = new THREE.Vector2(
        (Input.coords().x1 / width) * 2 - 1,
        -(Input.coords().y1 / height) * 2 + 1
      );
      var mouse2 = new THREE.Vector2(
        (Input.coords().x2 / width) * 2 - 1,
        -(Input.coords().y2 / height) * 2 + 1
      );
      var caster = new THREE.Raycaster();
      caster.setFromCamera(mouse1, camera);
      var p1 = caster.ray.intersectPlane(plane);
      caster.setFromCamera(mouse2, camera);
      var p2 = caster.ray.intersectPlane(plane);
      return {
        current: p2,
        previous: p1,
        diff: new THREE.Vector3().copy(p2).sub(p1)
      };
    },
    getMovementOnY: function () {
      return 0.2 * (Input.coords().y1 - Input.coords().y2);
    }
  };

});