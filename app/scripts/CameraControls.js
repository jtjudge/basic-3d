
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

  var interface = {
    init: function(camera) {
      if(!assertInit(false)) return;
      initialized = true;
      InputHandling.register({
        onmousemove: function(input) {
          if(input.mode === "EDIT" && (input.actions["CAM_PAN_TILT"] || input.actions["CAM_ORBIT"])) {
            var yAxis = new THREE.Vector3(0, 1, 0);
            var baseAngle = (input.actions["INC_SPEED_MOD"]) ? Math.PI / 120 : Math.PI / 360;
            var yAngle = baseAngle * (input.coords.x2 - input.coords.x1);
            var xAngle = baseAngle * (input.coords.y2 - input.coords.y1);
            var distance = camera.position.length();
            if(input.actions["CAM_PAN_TILT"]) {
              camera.rotateOnWorldAxis(yAxis, 0.2 * yAngle);
              camera.rotateX(0.2 * xAngle);
            }
            if(input.actions["CAM_ORBIT"]) {
              camera.translateZ(-distance);
              camera.rotateOnWorldAxis(yAxis, -yAngle);
              camera.rotateX(-xAngle);
              camera.translateZ(distance);
            }
          }
        },
        onupdate: function(input) {
          if(input.mode === "EDIT") {
            var speed = (input.actions["INC_SPEED_MOD"]) ? 6 : 2;
            if (input.actions["CAM_DOLLY_IN"]) {
              camera.translateZ(-speed);
            }
            if (input.actions["CAM_DOLLY_OUT"]) {
              camera.translateZ(speed);
            }
            if (input.actions["CAM_TRUCK_LEFT"]) {
              camera.translateX(-speed);
            }
            if (input.actions["CAM_TRUCK_RIGHT"]) {
              camera.translateX(speed);
            }
            if (input.actions["CAM_PEDESTAL_UP"]) {
              camera.translateY(speed);
            }
            if (input.actions["CAM_PEDESTAL_DOWN"]) {
              camera.translateY(-speed);
            }
            if (input.actions["CAM_RESET"]) {
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
      KeyBindings.addKeyBinding("LMB", "CAM_ORBIT");
      KeyBindings.addKeyBinding("MMB", "CAM_ORBIT");
      KeyBindings.addKeyBinding("RMB", "CAM_PAN_TILT");
      KeyBindings.addKeyBinding("ShiftLeft", "INC_SPEED_MOD");
      KeyBindings.addKeyBinding("ShiftRight", "INC_SPEED_MOD");
    }
  };

  return interface;

})();
