
Basic3D.loadModule("CameraControls", function (InputHandling, Scene) {

  var cam = Scene.camera();
  var invertOrbit = 1;
  var snapVert = true;

  function shiftCam(input) {
    var xDist = 0, yDist = 0, zDist = 0;
    var speed = (input.actions["CAM_SPEED_MOD"]) ?  6 : 2;
    if(input.actions["CAM_SHIFT_FREE"]) {
      xDist += (input.coords.x1 - input.coords.x2) * 0.25;
      yDist += (input.coords.y2 - input.coords.y1) * 0.25;
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

  function orbitCam(input, axis, angle) {
    var xAngle = 0, yAngle = 0, distance = cam.position.length();
    var baseAngle = (input.actions["CAM_SPEED_MOD"]) ? 0.003 :  0.001;
    var yAxis = new THREE.Vector3(0, 1, 0);
    if(input.actions["CAM_ORBIT_FREE"]) {
      xAngle += baseAngle * (input.coords.y1 - input.coords.y2) * invertOrbit;
      yAngle += baseAngle * (input.coords.x1 - input.coords.x2) * invertOrbit;
    } else if(axis !== undefined && angle !== undefined) {
      if(axis === "x") xAngle += angle;
      if(axis === "y") yAngle += angle;
    } else {
      if (input.actions["CAM_UP"]) xAngle += baseAngle * 10 * invertOrbit;
      if (input.actions["CAM_DOWN"]) xAngle += baseAngle * -10 * invertOrbit;
      if (input.actions["CAM_LEFT"]) yAngle += baseAngle * 10 * invertOrbit;
      if (input.actions["CAM_RIGHT"]) yAngle += baseAngle * -10 * invertOrbit;
    }
    cam.translateZ(-distance);
    cam.rotateOnWorldAxis(yAxis, -yAngle * 3);
    cam.rotateX(-xAngle * 3);
    cam.translateZ(distance);
  }

  function snapCam(angle) {
    var axis = new THREE.Vector3(0, 1, 0);
    var origin = new THREE.Vector3(0, 0, 0);
    var distance = 150;
    if(snapVert) {
      cam.position.set(0, distance, 0);
      cam.lookAt(origin);
      cam.rotateOnWorldAxis(axis, angle);
    } else {
      cam.position.set(0, 0, distance);
      cam.lookAt(origin);
      cam.translateZ(-150);
      cam.rotateOnWorldAxis(axis, angle);
      cam.translateZ(150);
    }
  }

  function resetCam() {
    cam.position.set(150, 100, 150);
    cam.lookAt(new THREE.Vector3(0, 0, 0));
  }

  InputHandling.register({
    onupdate: function (input) {
      if (input.mode !== "EDIT") return;
      if (input.actions["CAM_ORBIT"]) {
        orbitCam(input);
      }
      if(input.actions["CAM_SHIFT"]) {
        shiftCam(input);
      }
    },
    onkeydown: function (input) {
      if (input.actions["CAM_RESET"]) resetCam();
      if (input.actions["CAM_SWAP_AXIS"]) snapVert = !snapVert;
      if (input.actions["CAM_SNAP_BOTTOM_LEFT"]) {
        snapCam(3 * Math.PI / 2);
      }
      if (input.actions["CAM_SNAP_BOTTOM_RIGHT"]) {
        snapCam(Math.PI);
      }
      if (input.actions["CAM_SNAP_TOP_LEFT"]) {
        snapCam(2 * Math.PI);
      }
      if (input.actions["CAM_SNAP_TOP_RIGHT"]) {
        snapCam(Math.PI / 2);
      }
      if (input.actions["CAM_ORBIT_LEFT"]) {
        orbitCam(input, "y", invertOrbit * Math.PI / 6);
      }
      if (input.actions["CAM_ORBIT_RIGHT"]) {
        orbitCam(input, "y", invertOrbit * -Math.PI / 6);
      }
      if (input.actions["CAM_ORBIT_UP"]) {
        orbitCam(input, "x", invertOrbit * Math.PI / 6);
      }
      if (input.actions["CAM_ORBIT_DOWN"]) {
        orbitCam(input, "x", invertOrbit * -Math.PI / 6);
      }
    },
    onmousewheel: function (input) {
      cam.translateZ(input.scroll);
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

  InputHandling.addKeyBinding("Numpad0", "CAM_RESET");

  InputHandling.addKeyBinding("Numpad1", "CAM_SNAP_BOTTOM_LEFT");
  InputHandling.addKeyBinding("Numpad3", "CAM_SNAP_BOTTOM_RIGHT");
  InputHandling.addKeyBinding("Numpad7", "CAM_SNAP_TOP_LEFT");
  InputHandling.addKeyBinding("Numpad9", "CAM_SNAP_TOP_RIGHT");

  InputHandling.addKeyBinding("Numpad4", "CAM_ORBIT_LEFT");
  InputHandling.addKeyBinding("Numpad6", "CAM_ORBIT_RIGHT");
  InputHandling.addKeyBinding("Numpad8", "CAM_ORBIT_UP");
  InputHandling.addKeyBinding("Numpad2", "CAM_ORBIT_DOWN");

  InputHandling.addKeyBinding("Numpad5", "CAM_SWAP_AXIS");


  return {
    invertOrbit: function () {
      invertOrbit = -invertOrbit;
    }
  };

});

Basic3D.loadScript("InvertOrbit", function(CameraControls) {
  
  return function() {
    CameraControls.invertOrbit();
  };

});