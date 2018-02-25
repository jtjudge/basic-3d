
Basic3D.loadModule("AxisHelper", function (Debug, InputHandling) {
  let initialized = false;
  let scene, xAxis, yAxis, zAxis;

  function assertInit(val) {
    if (initialized && !val) {
      Debug.log("[AxisHelper] ERROR: Module already initialized");
      return false;
    } else if (!initialized && val) {
      Debug.log("[AxisHelper] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  var interface = {
    init: function (_scene) {
      if (!assertInit(false)) return;
      initialized = true;
      scene = _scene;

      let geometry, material;
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
            scene.remove(xAxis, yAxis, zAxis);
          }
        }
      });

    },
    setX: function (pos) {
      if (!assertInit(true)) return;
      scene.remove(xAxis, yAxis, zAxis);
      xAxis.position.copy(pos);
      scene.add(xAxis);
    },
    setY: function (pos) {
      if (!assertInit(true)) return;
      scene.remove(xAxis, yAxis, zAxis);
      yAxis.position.copy(pos);
      scene.add(yAxis);
    },
    setZ: function (pos) {
      if (!assertInit(true)) return;
      scene.remove(xAxis, yAxis, zAxis);
      zAxis.position.copy(pos);
      scene.add(zAxis);
    }
  };

  return interface;

});