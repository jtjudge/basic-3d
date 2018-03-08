
Basic3D.loadModule("Rotation", function (Input, Scene, Geometry, History) {

  var SPEED = 0.04;

  var move, center;

  function active(mode) {
    return mode === "ROTATE_X"
      || mode === "ROTATE_Y"
      || mode === "ROTATE_Z";
  }

  function setAxis() {
    center = Input.action("ROTATE_WORLD_MOD") ?
      new THREE.Vector3(0, 0, 0) : Geometry.getCenter();
    if (Input.mode("ROTATE_X")) {
      Scene.showX(center);
    }
    if (Input.mode("ROTATE_Y")) {
      Scene.showY(center);
    }
    if (Input.mode("ROTATE_Z")) {
      Scene.showZ(center);
    }
  }

  function rotateVertex(v, axis, angle) {

    var dx = v.obj.position.x - center.x;
    var dy = v.obj.position.y - center.y;
    var dz = v.obj.position.z - center.z;

    v.obj.translateX(-dx);
    v.obj.translateY(-dy);
    v.obj.translateZ(-dz);

    v.obj.rotateOnWorldAxis(axis, angle);

    v.obj.translateX(dx);
    v.obj.translateY(dy);
    v.obj.translateZ(dz);

    v.obj.rotation.set(0, 0, 0);

    v.edges.forEach(function (e) {
      e.obj.geometry.verticesNeedUpdate = true;
    });
    v.faces.forEach(function (f) {
      f.obj.geometry.verticesNeedUpdate = true;
    });
  }

  Input.register({
    onmousedown: function () {
      if (active(Input.mode()) && Input.action("ROTATE_CONFIRM")) {
        move.confirm();
        Input.nextMode("EDIT");
      }
    },
    onmousemove: function () {
      if (Input.mode("ROTATE_X")) {
        var axis = new THREE.Vector3(1, 0, 0);
        var angle = SPEED * Scene.getMovementOnXZ().diff.x;
        Geometry.getSelected().forEach(function (v) {
          rotateVertex(v, axis, angle);
        });
      }
      if (Input.mode("ROTATE_Y")) {
        var axis = new THREE.Vector3(0, 1, 0);
        var angle = SPEED * Scene.getMovementOnY();
        Geometry.getSelected().forEach(function (v) {
          rotateVertex(v, axis, angle);
        });
      }
      if (Input.mode("ROTATE_Z")) {
        var axis = new THREE.Vector3(0, 0, 1);
        var angle = SPEED * Scene.getMovementOnXZ().diff.z;
        Geometry.getSelected().forEach(function (v) {
          rotateVertex(v, axis, angle);
        });
      }
    },
    onkeydown: function () {
      if (Input.mode("EDIT")) {
        if (Input.action("TOGGLE_ROTATE_MODE")) {
          if (Geometry.getSelected().length > 0) {
            move = History.startMove(Geometry.getSelected());
            Input.nextMode("ROTATE_X");
            setAxis();
          }
        }
      } else if (active(Input.mode())) {
        if (Input.action("TOGGLE_ROTATE_MODE")) {
          move.cancel();
          Input.nextMode("EDIT");
        }
        if (Input.action("TOGGLE_TRANSLATE_MODE")) {
          move.confirm();
          if(Input.mode("ROTATE_X")) Input.nextMode("TRANSLATE_X");
          if(Input.mode("ROTATE_Y")) Input.nextMode("TRANSLATE_Y");
          if(Input.mode("ROTATE_Z")) Input.nextMode("TRANSLATE_Z");
        }
        if (Input.action("TOGGLE_SCALE_MODE")) {
          move.confirm();
          if(Input.mode("ROTATE_X")) Input.nextMode("SCALE_X");
          if(Input.mode("ROTATE_Y")) Input.nextMode("SCALE_Y");
          if(Input.mode("ROTATE_Z")) Input.nextMode("SCALE_Z");
        }
        if (Input.action("TOGGLE_ROTATE_X")) {
          Input.nextMode("ROTATE_X");
        }
        if (Input.action("TOGGLE_ROTATE_Y")) {
          Input.nextMode("ROTATE_Y");
        }
        if (Input.action("TOGGLE_ROTATE_Z")) {
          Input.nextMode("ROTATE_Z");
        }
        setAxis();
      }
    },
    onkeyup: function () {
      if (active(Input.mode())) setAxis();
    },
    onmode: function () {
      if (active(Input.mode())) {
        if (move === undefined || move.done()) {
          move = History.startMove(Geometry.getSelected());
        }
        setAxis();
      }
    }
  });

  Input.addKeyBinding("KeyR", "TOGGLE_ROTATE_MODE");
  Input.addKeyBinding("Space", "ROTATE_WORLD_MOD");
  Input.addKeyBinding("KeyX", "TOGGLE_ROTATE_X");
  Input.addKeyBinding("KeyY", "TOGGLE_ROTATE_Y");
  Input.addKeyBinding("KeyZ", "TOGGLE_ROTATE_Z");
  Input.addKeyBinding("LMB", "ROTATE_CONFIRM");

  return {};

});