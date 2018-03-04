
Basic3D.loadModule("CameraControls", function (InputHandling, Scene) {

  var cam = Scene.camera();

  InputHandling.register({
    onupdate: function (input) {
      if (input.mode === "EDIT") {
        var speed = 2;
        if (input.actions["CAM_SPEED_MOD"]) speed = 6;
        if (input.actions["CAM_IN"]) cam.translateZ(-speed);
        if (input.actions["CAM_OUT"]) cam.translateZ(speed);
        if (input.actions["CAM_RESET"]) {
          cam.position.set(150, 100, 150);
          cam.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if (!input.actions["CAM_ORBIT"]) {
          if (input.actions["CAM_LEFT"]) cam.translateX(-speed);
          if (input.actions["CAM_RIGHT"]) cam.translateX(speed);
          if (input.actions["CAM_UP"]) cam.translateY(speed);
          if (input.actions["CAM_DOWN"]) cam.translateY(-speed);
        } else {
          var baseAngle = 0.001, xAngle = 0, yAngle = 0;
          var distance = cam.position.length();
          var yAxis = new THREE.Vector3(0, 1, 0);
          if (input.actions["CAM_SPEED_MOD"]) baseAngle = 0.003;
          if(input.actions["CAM_ORBIT_FREE"]) {
            xAngle += baseAngle * (input.coords.y2 - input.coords.y1);
            yAngle += baseAngle * (input.coords.x2 - input.coords.x1);
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
      }
    }
  });

  InputHandling.addKeyBinding("KeyQ", "CAM_IN");
  InputHandling.addKeyBinding("KeyZ", "CAM_OUT");

  InputHandling.addKeyBinding("KeyW", "CAM_UP");
  InputHandling.addKeyBinding("KeyS", "CAM_DOWN");
  InputHandling.addKeyBinding("KeyA", "CAM_LEFT");
  InputHandling.addKeyBinding("KeyD", "CAM_RIGHT");

  InputHandling.addKeyBinding("KeyO", "CAM_RESET");

  InputHandling.addKeyBinding("LMB", "CAM_ORBIT");
  InputHandling.addKeyBinding("LMB", "CAM_ORBIT_FREE");
  InputHandling.addKeyBinding("MMB", "CAM_ORBIT");
  InputHandling.addKeyBinding("MMB", "CAM_ORBIT_FREE");

  InputHandling.addKeyBinding("Space", "CAM_ORBIT");

  InputHandling.addKeyBinding("ShiftLeft", "CAM_SPEED_MOD");
  InputHandling.addKeyBinding("ShiftRight", "CAM_SPEED_MOD");

  return {};

});
