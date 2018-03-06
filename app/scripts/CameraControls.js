
Basic3D.loadModule("CameraControls", function (InputHandling, Scene) {

  var cam = Scene.camera();
  var invertOrbit = 1;
  var snapVert = true;

  var smooth = (function () {
    // Lock other movements
    var lock = false, t;
    var dest = new THREE.Object3D();
    var origin = new THREE.Object3D();
    return {
      start: function () {
        origin.copy(cam, false);
        lock = true;
        t = 0;
      },
      move: function () {
        t += 0.1;
        
        var pos = new THREE.Vector3(
          origin.position.x + t * (dest.position.x - origin.position.x),
          origin.position.y + t * (dest.position.y - origin.position.y),
          origin.position.z + t * (dest.position.z - origin.position.z)
        );
        cam.position.copy(pos);
        
        var rot = new THREE.Vector3(
          origin.rotation.x + t * (dest.rotation.x - origin.rotation.x),
          origin.rotation.y + t * (dest.rotation.y - origin.rotation.y),
          origin.rotation.z + t * (dest.rotation.z - origin.rotation.z)
        );
        cam.rotation.setFromVector3(rot);
        
        if(t > 1) {
          cam.position.copy(dest.position);
          cam.rotation.copy(dest.rotation);
          lock = false;
        }
      },
      dest: function() {
        return dest;
      },
      locked: function() {
        return lock;
      }
    };
  })();

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

  function orbitCam(input) {
    var xAngle = 0, yAngle = 0, distance = cam.position.length();
    var baseAngle = (input.actions["CAM_SPEED_MOD"]) ? 0.003 :  0.001;
    var yAxis = new THREE.Vector3(0, 1, 0);
    if(input.actions["CAM_ORBIT_FREE"]) {
      xAngle += baseAngle * (input.coords.y1 - input.coords.y2) * invertOrbit;
      yAngle += baseAngle * (input.coords.x1 - input.coords.x2) * invertOrbit;
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
    var dest = smooth.dest();
    if(snapVert) {
      dest.position.set(0, distance, 0);
      dest.rotation.set(0, 0, 0);
      dest.rotateX(-Math.PI / 2);
      dest.rotateOnWorldAxis(axis, angle);
    } else {
      dest.position.set(0, 0, distance);
      dest.rotation.set(0, 0, 0);
      dest.translateZ(-150);
      dest.rotateOnWorldAxis(axis, angle);
      dest.translateZ(150);
    }
    smooth.start();
  }

  function snapOrbit(angle, vert) {
    var dest = smooth.dest(), distance;
    dest.position.copy(cam.position);
    dest.rotation.copy(cam.rotation);
    distance = dest.position.length();
    dest.translateZ(-distance);
    if(vert) {
      dest.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
    } else {
      dest.rotateX(angle);
    }
    dest.translateZ(distance);
    smooth.start();
  }

  function resetCam() {
    var dest = smooth.dest();
    dest.position.set(150, 100, 150);
    dest.rotation.set(0, 0, 0);
    dest.rotateX(-Math.PI / 8);
    dest.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    smooth.start();
  }

  InputHandling.register({
    onupdate: function (input) {
      if (input.mode !== "EDIT") return;
      if (smooth.locked()) {
        smooth.move();
        return;
      }
      if (input.actions["CAM_ORBIT"]) {
        orbitCam(input);
      }
      if(input.actions["CAM_SHIFT"]) {
        shiftCam(input);
      }
    },
    onkeydown: function (input) {
      if (input.mode !== "EDIT") return;
      if (smooth.locked()) {
        smooth.move();
        return;
      }
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
        snapOrbit(invertOrbit * Math.PI / 4, true);
      }
      if (input.actions["CAM_ORBIT_RIGHT"]) {
        snapOrbit(-invertOrbit * Math.PI / 4, true);
      }
      if (input.actions["CAM_ORBIT_UP"]) {
        snapOrbit(-invertOrbit * Math.PI / 4, false);
      }
      if (input.actions["CAM_ORBIT_DOWN"]) {
        snapOrbit(invertOrbit * Math.PI / 4, false);
      }
    },
    onmousewheel: function (input) {
      if (input.mode !== "EDIT") return;
      if (smooth.locked()) {
        smooth.move();
        return;
      }
      var dest = smooth.dest();
      dest.position.copy(cam.position);
      dest.rotation.copy(cam.rotation);
      dest.translateZ(input.scroll);
      smooth.start();
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