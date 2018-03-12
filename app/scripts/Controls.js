
Basic3D.loadModule("Controls", function (Input, Scene) {

  var cam = Scene.camera();
  var invertOrbit = 1;
  var snapVert = true;
  var scroll = 0;

  var locked = false;

  var smooth = (function () {
    var dest, orig, lock, t;
    dest = new THREE.Object3D();
    orig = new THREE.Object3D();
    lock = false;
    return {
      start: function () {
        orig.copy(cam, false);
        lock = true;
        t = 0;
      },
      move: function () {
        t += 0.05;
        var pos = new THREE.Vector3().copy(orig.position);
        pos.lerp(dest.position, t);
        cam.position.copy(pos);
        var q0 = new THREE.Quaternion().copy(orig.quaternion);
        q0.slerp(dest.quaternion, t);
        cam.rotation.setFromQuaternion(q0);
        if (t > 1) {
          cam.position.copy(dest.position);
          cam.rotation.copy(dest.rotation);
          lock = false;
        }
      },
      dest: function () {
        return dest;
      },
      locked: function () {
        return lock;
      }
    };
  })();

  function shiftCam() {
    var xDist = 0, yDist = 0, zDist = 0;
    var speed = (Input.action("CAM_SPEED_MOD")) ? 6 : 2;
    if (Input.action("CAM_SHIFT_FREE")) {
      xDist += (Input.coords().x1 - Input.coords().x2) * 0.25;
      yDist += (Input.coords().y2 - Input.coords().y1) * 0.25;
    } else {
      if (Input.action("CAM_LEFT")) xDist -= speed;
      if (Input.action("CAM_RIGHT")) xDist += speed;
      if (Input.action("CAM_UP")) yDist += speed;
      if (Input.action("CAM_DOWN")) yDist -= speed;
      if (Input.action("CAM_IN")) zDist -= speed;
      if (Input.action("CAM_OUT")) zDist += speed;
    }
    cam.translateX(xDist);
    cam.translateY(yDist);
    cam.translateZ(zDist);
  }

  function orbitCam() {
    var xAngle = 0, yAngle = 0, distance = cam.position.length();
    var baseAngle = (Input.action("CAM_SPEED_MOD")) ? 0.003 : 0.001;
    var yAxis = new THREE.Vector3(0, 1, 0);
    if (Input.action("CAM_ORBIT_FREE")) {
      xAngle += baseAngle * (Input.coords().y1 - Input.coords().y2) * invertOrbit;
      yAngle += baseAngle * (Input.coords().x1 - Input.coords().x2) * invertOrbit;
    } else {
      if (Input.action("CAM_UP")) xAngle += baseAngle * 10 * invertOrbit;
      if (Input.action("CAM_DOWN")) xAngle += baseAngle * -10 * invertOrbit;
      if (Input.action("CAM_LEFT")) yAngle += baseAngle * 10 * invertOrbit;
      if (Input.action("CAM_RIGHT")) yAngle += baseAngle * -10 * invertOrbit;
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
    if (snapVert) {
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
    if (vert) {
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

  function condition() {
    return !locked && (Input.mode("EDIT")
      || Input.mode("START_CIRCLE")
      || Input.mode("START_BOX"));
  }


  Input.register({
    onkeydown: function () {
      if (!condition()) return;
      if (smooth.locked()) {
        smooth.move();
        return;
      }
      if (Input.action("CAM_RESET")) resetCam();
      if (Input.action("CAM_SWAP_AXIS")) snapVert = !snapVert;
      if (Input.action("CAM_SNAP_BOTTOM_LEFT")) {
        snapCam(3 * Math.PI / 2);
      }
      if (Input.action("CAM_SNAP_BOTTOM_RIGHT")) {
        snapCam(Math.PI);
      }
      if (Input.action("CAM_SNAP_TOP_LEFT")) {
        snapCam(2 * Math.PI);
      }
      if (Input.action("CAM_SNAP_TOP_RIGHT")) {
        snapCam(Math.PI / 2);
      }
      if (Input.action("CAM_ORBIT_LEFT")) {
        snapOrbit(invertOrbit * Math.PI / 4, true);
      }
      if (Input.action("CAM_ORBIT_RIGHT")) {
        snapOrbit(-invertOrbit * Math.PI / 4, true);
      }
      if (Input.action("CAM_ORBIT_UP")) {
        snapOrbit(-invertOrbit * Math.PI / 4, false);
      }
      if (Input.action("CAM_ORBIT_DOWN")) {
        snapOrbit(invertOrbit * Math.PI / 4, false);
      }
    },
    onmousewheel: function () {
      if (!condition()) return;
      scroll += Input.scroll();
      if (scroll > 200) scroll = 200;
      if (scroll < -200) scroll = -200;
    }
  });

  Input.addKeyBinding("KeyO", "CAM_RESET");

  Input.addKeyBinding("KeyW", "CAM_UP");
  Input.addKeyBinding("KeyS", "CAM_DOWN");
  Input.addKeyBinding("KeyA", "CAM_LEFT");
  Input.addKeyBinding("KeyD", "CAM_RIGHT");
  Input.addKeyBinding("KeyQ", "CAM_IN");
  Input.addKeyBinding("KeyZ", "CAM_OUT");

  Input.addKeyBinding("Space", "CAM_ORBIT");
  Input.addInvertBinding("Space", "CAM_SHIFT");

  Input.addKeyBinding("LMB", "CAM_ORBIT");
  Input.addKeyBinding("LMB", "CAM_ORBIT_FREE");
  Input.addKeyBinding("MMB", "CAM_ORBIT");
  Input.addKeyBinding("MMB", "CAM_ORBIT_FREE");
  Input.addKeyBinding("RMB", "CAM_SHIFT_FREE");

  Input.addKeyBinding("ShiftLeft", "CAM_SPEED_MOD");
  Input.addKeyBinding("ShiftRight", "CAM_SPEED_MOD");

  Input.addKeyBinding("Numpad0", "CAM_RESET");

  Input.addKeyBinding("Numpad1", "CAM_SNAP_BOTTOM_LEFT");
  Input.addKeyBinding("Numpad3", "CAM_SNAP_BOTTOM_RIGHT");
  Input.addKeyBinding("Numpad7", "CAM_SNAP_TOP_LEFT");
  Input.addKeyBinding("Numpad9", "CAM_SNAP_TOP_RIGHT");

  Input.addKeyBinding("Numpad4", "CAM_ORBIT_LEFT");
  Input.addKeyBinding("Numpad6", "CAM_ORBIT_RIGHT");
  Input.addKeyBinding("Numpad8", "CAM_ORBIT_UP");
  Input.addKeyBinding("Numpad2", "CAM_ORBIT_DOWN");

  Input.addKeyBinding("Numpad5", "CAM_SWAP_AXIS");


  return {
    update: function () {
      if (!condition()) return;
      if (smooth.locked()) {
        smooth.move();
        return;
      }
      if (Input.action("CAM_ORBIT")) orbitCam();
      if (Input.action("CAM_SHIFT")) shiftCam();
      if (scroll !== 0) {
        var diff = (scroll > 0) ? -10 : 10;
        scroll += diff;
        cam.translateZ(-diff);
      }
    },
    invertOrbit: function () {
      invertOrbit = -invertOrbit;
    },
    enable: function () {
      locked = false;
    },
    disable: function () {
      locked = true;
    }
  };

});

Basic3D.loadScript("InvertOrbit", function (Controls) {

  return function () {
    Controls.invertOrbit();
  };

});