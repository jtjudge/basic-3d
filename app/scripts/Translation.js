
Basic3D.loadModule("Translation", function (Input, Scene, Geometry, Selection, History, TipsDisplay, Snapping) {

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
        Input.setMode("EDIT");
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
            Input.setMode("TRANSLATE_X");
          }
        }
      }
      else if(Input.action("SNAP")) {
        if(Snapping.update()) {
        Input.setMode("LOCK");
        }
      }
       else if (active(Input.mode()) && !Input.mode("LOCK")) {
        if (Input.action("TOGGLE_TRANSLATE_MODE")) {
          move.cancel();
          Input.setMode("EDIT");
        }
        if (Input.action("TOGGLE_ROTATE_MODE")) {
          move.confirm();
          if(Input.mode("TRANSLATE_X")) Input.setMode("ROTATE_X");
          if(Input.mode("TRANSLATE_Y")) Input.setMode("ROTATE_Y");
          if(Input.mode("TRANSLATE_Z")) Input.setMode("ROTATE_Z");
        }
        if (Input.action("TOGGLE_SCALE_MODE")) {
          move.confirm();
          if(Input.mode("TRANSLATE_X")) Input.setMode("SCALE_X");
          if(Input.mode("TRANSLATE_Y")) Input.setMode("SCALE_Y");
          if(Input.mode("TRANSLATE_Z")) Input.setMode("SCALE_Z");
        }
        if (Input.action("TOGGLE_TRANSLATE_X")) {
          Input.setMode("TRANSLATE_X");
        }
        if (Input.action("TOGGLE_TRANSLATE_Y")) {
          Input.setMode("TRANSLATE_Y");
        }
        if (Input.action("TOGGLE_TRANSLATE_Z")) {
          Input.setMode("TRANSLATE_Z");
        }
      }
    },
    onkeyup: function() {
      if(Input.mode("LOCK")) {
        Snapping.remove();
        Input.setMode("EDIT");
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

  Input.addKeyBinding("KeyT", "TOGGLE_TRANSLATE_MODE", "Toggle Translate Mode");
  Input.addKeyBinding("KeyX", "TOGGLE_TRANSLATE_X");
  Input.addKeyBinding("KeyY", "TOGGLE_TRANSLATE_Y");
  Input.addKeyBinding("KeyZ", "TOGGLE_TRANSLATE_Z");
  Input.addKeyBinding("LMB", "TRANSLATE_CONFIRM");

  TipsDisplay.registerMode({
    name: "TRANSLATE",
    mapped: ["TRANSLATE_X", "TRANSLATE_Y", "TRANSLATE_Z"],
    display: "Translate"
  });

  TipsDisplay.registerTip({
    mode: "TRANSLATE",
    builder: function (get) {
      return `${get("TOGGLE_TRANSLATE_MODE")} to cancel`;
    }
  });
  TipsDisplay.registerTip({
    mode: "TRANSLATE",
    builder: function(get) {
      return `${get("TRANSLATE_CONFIRM")} to confirm`;
    }
  });
  TipsDisplay.registerTip({
    mode: "TRANSLATE",
    builder: function(get) {
      var x = get("TOGGLE_TRANSLATE_X");
      var y = get("TOGGLE_TRANSLATE_Y");
      var z = get("TOGGLE_TRANSLATE_Z");
      return `${x}, ${y}, or ${z} to swap axis`;
    }
  });
  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function(get) {
      return `${get("TOGGLE_TRANSLATE_MODE")} to translate`;
    },
    condition: function() {
      return Geometry.getSelected().length > 0;
    }
  });

  return {};

});
