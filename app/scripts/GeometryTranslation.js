
Basic3D.loadModule("GeometryTranslation", function (InputHandling, Scene, Geometry, History) {

  var SPEED = 0.05;

  var move;

  function active(mode) {
    return (mode === "TRANSLATE_MODE" ||
      mode === "TRANSLATE_X" ||
      mode === "TRANSLATE_Y" ||
      mode === "TRANSLATE_Z");
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

  InputHandling.register({
    onmousedown: function (input) {
      if (active(input.mode) && input.actions["TRANSLATE_CONFIRM"]) {
        move.confirm();
        InputHandling.mode("EDIT");
      }
    },
    onmousemove: function (input) {
      if (input.mode === "TRANSLATE_X") {
        var dx = Scene.getMovementOnXZ(input).diff.x;
        Geometry.getSelected().forEach(function (v) {
          translateVertex(v, new THREE.Vector3(dx, 0, 0));
        });
      }
      if (input.mode === "TRANSLATE_Y") {
        var dy = Scene.getMovementOnY(input);
        Geometry.getSelected().forEach(function (v) {
          translateVertex(v, new THREE.Vector3(0, dy, 0));
        });
      }
      if (input.mode === "TRANSLATE_Z") {
        var dz = Scene.getMovementOnXZ(input).diff.z;
        Geometry.getSelected().forEach(function (v) {
          translateVertex(v, new THREE.Vector3(0, 0, dz));
        });
      }
    },
    onkeydown: function (input) {
      if (input.actions["TOGGLE_TRANSLATE_MODE"]) {
        if (!active(input.mode)) {
          if (Geometry.getSelected().length === 0) {
            InputHandling.mode("EDIT");
          } else {
            move = History.startMove(Geometry.getSelected());
            InputHandling.mode("TRANSLATE_MODE");
          }
        } else {
          move.cancel();
          InputHandling.mode("EDIT");
        }
      } else if (active(input.mode)) {
        if (input.actions["TOGGLE_TRANSLATE_X"]) {
          InputHandling.mode("TRANSLATE_X");
        }
        if (input.actions["TOGGLE_TRANSLATE_Y"]) {
          InputHandling.mode("TRANSLATE_Y");
        }
        if (input.actions["TOGGLE_TRANSLATE_Z"]) {
          InputHandling.mode("TRANSLATE_Z");
        }
      }
    },
    onmode: function (input) {
      if (input.mode === "TRANSLATE_X") {
        Scene.showX(Geometry.getCenter());
      }
      if (input.mode === "TRANSLATE_Y") {
        Scene.showY(Geometry.getCenter());
      }
      if (input.mode === "TRANSLATE_Z") {
        Scene.showZ(Geometry.getCenter());
      } 
    }
  });

  InputHandling.addKeyBinding("KeyT", "TOGGLE_TRANSLATE_MODE");
  InputHandling.addKeyBinding("KeyX", "TOGGLE_TRANSLATE_X");
  InputHandling.addKeyBinding("KeyY", "TOGGLE_TRANSLATE_Y");
  InputHandling.addKeyBinding("KeyZ", "TOGGLE_TRANSLATE_Z");
  InputHandling.addKeyBinding("LMB", "TRANSLATE_CONFIRM");

  return {};

});
