function addControls(c) {
  var camera = c;
  var input = [];
  var mouseCoords = {
    x: 0,
    y: 0
  };

  function reset() {
    camera.position.set(150, 100, 150);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  reset();
  return {
    keyDown: function(event) {
      input[event.code] = true;
    },
    keyUp: function(event) {
      input[event.code] = false;
    },
    mouseDown: function(event) {
      event.preventDefault();
      switch (event.which) {
        case 1:
          input["LMB"] = true;
          break;
        case 2:
          input["MMB"] = true;
          break;
        case 3:
          input["RMB"] = true;
          break;
        default:
          break;
      }
    },
    mouseUp: function(event) {
      switch (event.which) {
        case 1:
          input["LMB"] = false;
          break;
        case 2:
          input["MMB"] = false;
          break;
        case 3:
          input["RMB"] = false;
          break;
        default:
          break;
      }
    },
    mouseMove: function(coords) {
      if (input["RMB"] || input["MMB"]) {
        var base = (input["ShiftLeft"] || input["ShiftRight"])
          ? Math.PI / 120
          : Math.PI / 360;
        var yAngle = base * (coords.x - mouseCoords.x);
        var xAngle = base * (coords.y - mouseCoords.y);
        if (input["RMB"]) {
          // Right-click pans the camera
          camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.2 * yAngle);
          camera.rotateX(0.2 * xAngle);
        } else {
          // Middle-click orbits the camera
          var distance = camera.position.length();
          camera.translateZ(-distance);
          camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -yAngle);
          camera.rotateX(-xAngle);
          camera.translateZ(distance);
        }
      }
      mouseCoords = coords;
    },
    placePoint: function(event, scene) {
      if (input["LMB"] && input["KeyV"]) {
        var vector = new THREE.Vector3();
        vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        vector.unproject(camera);
        var dir = vector.sub(camera.position).normalize();
        var distance = -camera.position.z / dir.z;
        var pos = camera.position.clone().add(dir.multiplyScalar(distance));
        console.log("x: " + pos.x + ", y: " + pos.y);

      }
    },
    update: function() {
      var speed = (input["ShiftLeft"] || input["ShiftRight"])
        ? 6
        : 2;
      if (input["KeyW"]) {
        camera.translateZ(-speed);
      }
      if (input["KeyA"]) {
        camera.translateX(-speed);
      }
      if (input["KeyS"]) {
        camera.translateZ(speed);
      }
      if (input["KeyD"]) {
        camera.translateX(speed);
      }
      if (input["KeyQ"]) {
        camera.translateY(speed);
      }
      if (input["KeyZ"]) {
        camera.translateY(-speed);
      }
      if (input["KeyO"]) {
        reset();
      }
    }
  };
}
