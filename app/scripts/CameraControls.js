
Basic3D.loadModule("CameraControls", function (InputHandling, Scene) {

  var cam = Scene.camera();

  function rotateCam(input) {
    if (input.mode !== "EDIT") return;
    var baseAngle = 0.001;
    if (input.actions["CAM_SPEED_MOD"]) baseAngle *= 3;
    var distance = cam.position.length();
    var yAxis = new THREE.Vector3(0, 1, 0);
    var xAngle = 0, yAngle = 0;
    if (input.actions["CAM_TILT_FREE"]) {
      xAngle += baseAngle * (input.coords.y2 - input.coords.y1);
      yAngle += baseAngle * (input.coords.x2 - input.coords.x1);
    }
    if (input.actions["CAM_TILT_UP"]) xAngle += baseAngle * 10;
    if (input.actions["CAM_TILT_DOWN"]) xAngle -= baseAngle * 10;
    if (input.actions["CAM_TILT_LEFT"]) yAngle += baseAngle * 10;
    if (input.actions["CAM_TILT_RIGHT"]) yAngle -= baseAngle * 10;
    if (input.actions["CAM_ORBIT_MOD"]) {
      cam.translateZ(-distance);
      cam.rotateOnWorldAxis(yAxis, yAngle * 3);
      cam.rotateX(xAngle * 3);
      cam.translateZ(distance);
    } else {
      cam.rotateOnWorldAxis(yAxis, yAngle);
      cam.rotateX(xAngle);
    }
  }

  InputHandling.register({
    onmousemove: rotateCam,
    onupdate: function (input) {
      if (input.mode === "EDIT") {
        var speed = 2;
        if (input.actions["CAM_SPEED_MOD"]) speed *= 3;
        if (input.actions["CAM_DOLLY_IN"]) cam.translateZ(-speed);
        if (input.actions["CAM_DOLLY_OUT"]) cam.translateZ(speed);
        if (input.actions["CAM_TRUCK_LEFT"]) cam.translateX(-speed);
        if (input.actions["CAM_TRUCK_RIGHT"]) cam.translateX(speed);
        if (input.actions["CAM_PEDESTAL_UP"]) cam.translateY(speed);
        if (input.actions["CAM_PEDESTAL_DOWN"]) cam.translateY(-speed);
        if (input.actions["CAM_RESET"]) {
          cam.position.set(150, 100, 150);
          cam.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if (input.actions["CAM_TILT_UP"] ||
          input.actions["CAM_TILT_DOWN"] ||
          input.actions["CAM_TILT_LEFT"] ||
          input.actions["CAM_TILT_RIGHT"]) {
          rotateCam(input);
        }
      }
    }
  });

  InputHandling.addKeyBinding("KeyW", "CAM_DOLLY_IN");
  InputHandling.addKeyBinding("KeyS", "CAM_DOLLY_OUT");
  InputHandling.addKeyBinding("KeyA", "CAM_TRUCK_LEFT");
  InputHandling.addKeyBinding("KeyD", "CAM_TRUCK_RIGHT");
  InputHandling.addKeyBinding("KeyQ", "CAM_PEDESTAL_UP");
  //InputHandling.addKeyBinding("KeyZ", "CAM_PEDESTAL_DOWN");
  InputHandling.addKeyBinding("KeyO", "CAM_RESET");

  InputHandling.addKeyBinding("LMB", "CAM_TILT_FREE");
  InputHandling.addKeyBinding("LMB", "CAM_ORBIT_MOD");
  InputHandling.addKeyBinding("MMB", "CAM_TILT_FREE");
  InputHandling.addKeyBinding("MMB", "CAM_ORBIT_MOD");
  InputHandling.addKeyBinding("RMB", "CAM_TILT_FREE");

  InputHandling.addKeyBinding("ShiftLeft", "CAM_SPEED_MOD");
  InputHandling.addKeyBinding("ShiftRight", "CAM_SPEED_MOD");

  InputHandling.addKeyBinding("KeyI", "CAM_TILT_UP");
  InputHandling.addKeyBinding("KeyK", "CAM_TILT_DOWN");
  InputHandling.addKeyBinding("KeyJ", "CAM_TILT_LEFT");
  InputHandling.addKeyBinding("KeyL", "CAM_TILT_RIGHT");
  InputHandling.addKeyBinding("Space", "CAM_ORBIT_MOD");

  return {};

});
