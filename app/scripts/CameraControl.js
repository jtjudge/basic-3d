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
      if (input["RMB"] || input["LMB"]) {
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
    placePoint: function(event, rect, positions, count, scene) {
      if (input["LMB"] && input["KeyV"]) {
        var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        mouse.x = ((event.clientX - rect.left) / rect.width ) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersection = raycaster.ray.intersectPlane(plane);
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3(intersection.x, 0, intersection.z));
        var dotMaterial = new THREE.PointsMaterial({size: 3, sizeAttenuation: false});
        var dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
        positions[count.c * 3 + 0] = intersection.x;
        positions[count.c * 3 + 1] = intersection.y;
        positions[count.c * 3 + 2] = intersection.z;
        count.c++;
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
