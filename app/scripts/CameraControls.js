
Basic3D.loadModule("CameraControls", function (InputHandling, Scene) {

  var cam = Scene.camera();

  function shiftCam(input) {
    var xDist = 0, yDist = 0, zDist = 0;
    var invert = (input.actions["CAM_INVERT"]) ? -1 : 1;
    var speed = (input.actions["CAM_SPEED_MOD"]) ?  6 : 2;
    if(input.actions["CAM_SHIFT_FREE"]) {
      xDist += (input.coords.x1 - input.coords.x2) * invert * 0.25;
      yDist += (input.coords.y2 - input.coords.y1) * invert * 0.25;
    } else {
      if (input.actions["CAM_LEFT"]) xDist -= speed;
      if (input.actions["CAM_RIGHT"]) xDist += speed;
      if (input.actions["CAM_UP"]) yDist += speed;
      if (input.actions["CAM_DOWN"]) yDist -= speed;
      if (input.actions["CAM_IN"]) zDist -= speed;
      if (input.actions["CAM_OUT"]) zDist += speed;
    }
    cam.translateX(xDist);
    cam.translateY(yDist);
    cam.translateZ(zDist);
  }

  function orbitCam(input) {
    var xAngle = 0, yAngle = 0, distance = cam.position.length();
    var baseAngle = (input.actions["CAM_SPEED_MOD"]) ? 0.003 :  0.001;
    var yAxis = new THREE.Vector3(0, 1, 0);
    if(input.actions["CAM_ORBIT_FREE"]) {
      xAngle += baseAngle * (input.coords.y1 - input.coords.y2);
      yAngle += baseAngle * (input.coords.x1 - input.coords.x2);
    } else {
      if (input.actions["CAM_UP"]) xAngle += baseAngle * 10;
      if (input.actions["CAM_DOWN"]) xAngle -= baseAngle * 10;
      if (input.actions["CAM_LEFT"]) yAngle += baseAngle * 10;
      if (input.actions["CAM_RIGHT"]) yAngle -= baseAngle * 10;
    }
    cam.translateZ(-distance);
    cam.rotateOnWorldAxis(yAxis, -yAngle * 3);
    cam.rotateX(-xAngle * 3);
    cam.translateZ(distance);
  }

  InputHandling.register({
    onupdate: function (input) {
      if (input.mode !== "EDIT") return;
      if (input.actions["CAM_RESET"]) {
        cam.position.set(150, 100, 150);
        cam.lookAt(new THREE.Vector3(0, 0, 0));
      }
      if (input.actions["CAM_ORBIT"]) {
        orbitCam(input);
      }
      if(input.actions["CAM_SHIFT"]) {
        shiftCam(input);
      }
    }
  });

  InputHandling.addKeyBinding("KeyO", "CAM_RESET");

  InputHandling.addKeyBinding("KeyW", "CAM_UP");
  InputHandling.addKeyBinding("KeyS", "CAM_DOWN");
  InputHandling.addKeyBinding("KeyA", "CAM_LEFT");
  InputHandling.addKeyBinding("KeyD", "CAM_RIGHT");
  InputHandling.addKeyBinding("KeyQ", "CAM_IN");
  InputHandling.addKeyBinding("KeyZ", "CAM_OUT");

  InputHandling.addKeyBinding("Space", "CAM_ORBIT");
  InputHandling.addInvertBinding("Space", "CAM_SHIFT");

  InputHandling.addKeyBinding("LMB", "CAM_ORBIT");
  InputHandling.addKeyBinding("LMB", "CAM_ORBIT_FREE");
  InputHandling.addKeyBinding("MMB", "CAM_ORBIT");
  InputHandling.addKeyBinding("MMB", "CAM_ORBIT_FREE");
  InputHandling.addKeyBinding("RMB", "CAM_SHIFT_FREE");

  InputHandling.addKeyBinding("ShiftLeft", "CAM_SPEED_MOD");
  InputHandling.addKeyBinding("ShiftRight", "CAM_SPEED_MOD");

  return {};

});
