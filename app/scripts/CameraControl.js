
function initCameraControls(camera, handler) {

  var vMode = false;

  function reset() {
    camera.position.set(150, 100, 150);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  reset();

  handler.register({
    onkeydown: function(input, coords) {
      if(input["KeyV"]) vMode = !vMode;
    },
    onmousemove: function(input, coords) {
      if(vMode) return;
      if (input["LMB"] || input["RMB"]) {
        var base = (input["ShiftLeft"] || input["ShiftRight"])
          ? Math.PI / 120
          : Math.PI / 360;
        var yAngle = base * (coords.x2 - coords.x1);
        var xAngle = base * (coords.y2 - coords.y1);
        if (input["RMB"]) {
          // Right-click pans the camera
          camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.2 * yAngle);
          camera.rotateX(0.2 * xAngle);
        } else {
          // Left-click orbits the camera
          var distance = camera.position.length();
          camera.translateZ(-distance);
          camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -yAngle);
          camera.rotateX(-xAngle);
          camera.translateZ(distance);
        }
      }
    },
    onupdate: function(input, coords) {
      if(vMode) return;
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
  });

}
