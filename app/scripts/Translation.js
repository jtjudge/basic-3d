
Basic3D.loadModule("Translation", function (Input, Scene, Geometry, History) {

  var SPEED = 0.05;

  var move;

  function active(mode) {
    return mode === "TRANSLATE_X"
      || mode === "TRANSLATE_Y"
      || mode === "TRANSLATE_Z";
  }

  function translateVertex(v, diff) {
    v.obj.position.add(diff);
    v.edges.forEach(function (e) {
      e.obj.geometry.verticesNeedUpdate = true;
    });
    v.faces.forEach(function (f) {
      f.obj.geometry.verticesNeedUpdate = true;
    });
  }

  Input.register({
    onmousedown: function () {
      if (active(Input.mode()) && Input.action("TRANSLATE_CONFIRM")) {
        move.confirm();
        Input.nextMode("EDIT");
      }
    },
    onmousemove: function () {
      if (Input.mode("TRANSLATE_X")) {
        var dx = Scene.getMovementOnXZ().diff.x;
        Geometry.getSelected().forEach(function (v) {
          translateVertex(v, new THREE.Vector3(dx, 0, 0));
        });
      }
      if (Input.mode("TRANSLATE_Y")) {
        var dy = Scene.getMovementOnY();
        Geometry.getSelected().forEach(function (v) {
          translateVertex(v, new THREE.Vector3(0, dy, 0));
        });
      }
      if (Input.mode("TRANSLATE_Z")) {
        var dz = Scene.getMovementOnXZ().diff.z;
        Geometry.getSelected().forEach(function (v) {
          translateVertex(v, new THREE.Vector3(0, 0, dz));
        });
      }
    },
    onkeydown: function () {
      if (Input.mode("EDIT")) {
        if (Input.action("TOGGLE_TRANSLATE_MODE")) {
          if (Geometry.getSelected().length > 0) {
            move = History.startMove(Geometry.getSelected());
            Input.nextMode("TRANSLATE_X");
          }
        }
      } else if (active(Input.mode())) {
        if (Input.action("TOGGLE_TRANSLATE_MODE")) {
          move.cancel();
          Input.nextMode("EDIT");
        }
        if (Input.action("TOGGLE_ROTATE_MODE")) {
          move.confirm();
          if(Input.mode("TRANSLATE_X")) Input.nextMode("ROTATE_X");
          if(Input.mode("TRANSLATE_Y")) Input.nextMode("ROTATE_Y");
          if(Input.mode("TRANSLATE_Z")) Input.nextMode("ROTATE_Z");
        }
        if (Input.action("TOGGLE_SCALE_MODE")) {
          move.confirm();
          if(Input.mode("TRANSLATE_X")) Input.nextMode("SCALE_X");
          if(Input.mode("TRANSLATE_Y")) Input.nextMode("SCALE_Y");
          if(Input.mode("TRANSLATE_Z")) Input.nextMode("SCALE_Z");
        }
        if (Input.action("TOGGLE_TRANSLATE_X")) {
          Input.nextMode("TRANSLATE_X");
        }
        if (Input.action("TOGGLE_TRANSLATE_Y")) {
          Input.nextMode("TRANSLATE_Y");
        }
        if (Input.action("TOGGLE_TRANSLATE_Z")) {
          Input.nextMode("TRANSLATE_Z");
        }
      }
    },
    onmode: function () {
      if (active(Input.mode())) {
        if (move === undefined || move.done()) {
          move = History.startMove(Geometry.getSelected());
        }
      }
      if (Input.mode("TRANSLATE_X")) {
        Scene.showX(Geometry.getCenter());
      }
      if (Input.mode("TRANSLATE_Y")) {
        Scene.showY(Geometry.getCenter());
      }
      if (Input.mode("TRANSLATE_Z")) {
        Scene.showZ(Geometry.getCenter());
      }
    }
  });

  Input.addKeyBinding("KeyT", "TOGGLE_TRANSLATE_MODE");
  Input.addKeyBinding("KeyX", "TOGGLE_TRANSLATE_X");
  Input.addKeyBinding("KeyY", "TOGGLE_TRANSLATE_Y");
  Input.addKeyBinding("KeyZ", "TOGGLE_TRANSLATE_Z");
  Input.addKeyBinding("LMB", "TRANSLATE_CONFIRM");

  return {};

});
