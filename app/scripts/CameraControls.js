
var CameraControls = (function() {

  var initialized = false;

  function assertInit(val) {
    if(initialized && !val) {
      Debug.log("[CameraControls] ERROR: Module already initialized");
      return false;
    } else if(!initialized && val) {
      Debug.log("[CameraControls] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  function rotateCam(input, camera) {
    if(input.mode !== "EDIT") return;

    var baseAngle = 0.001;
    if(input.actions["CAM_SPEED_MOD"]) baseAngle *= 3;

    var distance = camera.position.length();
    var yAxis = new THREE.Vector3(0, 1, 0);

    var xAngle = 0, yAngle = 0;

    if(input.actions["CAM_TILT_FREE"]) {
      xAngle += baseAngle * (input.coords.y2 - input.coords.y1);
      yAngle += baseAngle * (input.coords.x2 - input.coords.x1);
    }

    if(input.actions["CAM_TILT_UP"]) xAngle += baseAngle * 100;
    if(input.actions["CAM_TILT_DOWN"]) xAngle -= baseAngle * 100;
    if(input.actions["CAM_TILT_LEFT"]) yAngle += baseAngle * 100;
    if(input.actions["CAM_TILT_RIGHT"]) yAngle -= baseAngle * 100;

    if(input.actions["CAM_ORBIT_MOD"]) {
      camera.translateZ(-distance);
      camera.rotateOnWorldAxis(yAxis, yAngle * 3);
      camera.rotateX(xAngle * 3);
      camera.translateZ(distance);
    } else {
      camera.rotateOnWorldAxis(yAxis, yAngle);
      camera.rotateX(xAngle);
    }

  }

  var interface = {
    init: function(camera) {
      if(!assertInit(false)) return;
      initialized = true;
      InputHandling.register({
        onkeydown: function(input) {
          rotateCam(input, camera);
        },
        onmousemove: function(input) {
          rotateCam(input, camera);
        },
        onupdate: function(input) {
          if(input.mode === "EDIT") {
            var speed = 2;
            if(input.actions["CAM_SPEED_MOD"]) speed *= 3;
            if(input.actions["CAM_DOLLY_IN"]) camera.translateZ(-speed);
            if(input.actions["CAM_DOLLY_OUT"]) camera.translateZ(speed);
            if(input.actions["CAM_TRUCK_LEFT"]) camera.translateX(-speed);
            if(input.actions["CAM_TRUCK_RIGHT"]) camera.translateX(speed);
            if(input.actions["CAM_PEDESTAL_UP"]) camera.translateY(speed);
            if(input.actions["CAM_PEDESTAL_DOWN"]) camera.translateY(-speed);
            if(input.actions["CAM_RESET"]) {
              camera.position.set(150, 100, 150);
              camera.lookAt(new THREE.Vector3(0, 0, 0));
            }
          }
        }
      });
      KeyBindings.addKeyBinding("KeyW", "CAM_DOLLY_IN");
      KeyBindings.addKeyBinding("KeyS", "CAM_DOLLY_OUT");
      KeyBindings.addKeyBinding("KeyA", "CAM_TRUCK_LEFT");
      KeyBindings.addKeyBinding("KeyD", "CAM_TRUCK_RIGHT");
      KeyBindings.addKeyBinding("KeyQ", "CAM_PEDESTAL_UP");
      KeyBindings.addKeyBinding("KeyZ", "CAM_PEDESTAL_DOWN");

      KeyBindings.addKeyBinding("KeyO", "CAM_RESET");

      KeyBindings.addKeyBinding("LMB", "CAM_TILT_FREE");
      KeyBindings.addKeyBinding("LMB", "CAM_ORBIT_MOD");

      KeyBindings.addKeyBinding("MMB", "CAM_TILT_FREE");
      KeyBindings.addKeyBinding("MMB", "CAM_ORBIT_MOD");

      KeyBindings.addKeyBinding("RMB", "CAM_TILT_FREE");

      KeyBindings.addKeyBinding("ShiftLeft", "CAM_SPEED_MOD");
      KeyBindings.addKeyBinding("ShiftRight", "CAM_SPEED_MOD");

      KeyBindings.addKeyBinding("ArrowUp", "CAM_TILT_UP");
      KeyBindings.addKeyBinding("ArrowDown", "CAM_TILT_DOWN");
      KeyBindings.addKeyBinding("ArrowLeft", "CAM_TILT_LEFT");
      KeyBindings.addKeyBinding("ArrowRight", "CAM_TILT_RIGHT");

      KeyBindings.addKeyBinding("Space", "CAM_ORBIT_MOD");
    }
  };

  return interface;

})();
