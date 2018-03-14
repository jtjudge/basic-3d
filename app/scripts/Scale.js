
Basic3D.loadModule("Scale", function (Input, Scene, Geometry, History) {

  var SPEED = 0.04;

  var move, center;

  function active(mode) {
    return mode === "SCALE_X"
      || mode === "SCALE_Y"
      || mode === "SCALE_Z";
  }

  function setAxis() {
    center = Input.action("SCALE_WORLD_MOD") ?
      new THREE.Vector3(0, 0, 0) : Geometry.getCenter();
    if (Input.mode("SCALE_X")) {
      Scene.showX(center);
    }
    if (Input.mode("SCALE_Y")) {
      Scene.showY(center);
    }
    if (Input.mode("SCALE_Z")) {
      Scene.showZ(center);
    }
  }

  function scaleVertex(v, diff) {
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
      if (active(Input.mode()) && Input.action("SCALE_CONFIRM")) {
        move.confirm();
        Input.setMode("EDIT");
      }
    },
    onmousemove: function () {
      if (Input.mode("SCALE_X")) {
        Geometry.getSelected().forEach(function (v) {
          var val = (Scene.getMovementOnXZ().diff.x > 0) ? (.99 * (v.obj.position.x - center.x) - (v.obj.position.x - center.x)) : (1.01 * (v.obj.position.x - center.x) - (v.obj.position.x - center.x));
          val = (Scene.getMovementOnXZ().diff.x == 0) ? 0 : val; 
          var diff = new THREE.Vector3(val, 0, 0);
          scaleVertex(v, diff);
        });
      }
      if (Input.mode("SCALE_Y")) {
        Geometry.getSelected().forEach(function (v) {
          var val = (Scene.getMovementOnY() > 0) ? (.99 * (v.obj.position.y - center.y) - (v.obj.position.y - center.y)) : (1.01 * (v.obj.position.y - center.y) - (v.obj.position.y - center.y));
          val = (Scene.getMovementOnY() == 0) ? 0 : val; 
          var diff = new THREE.Vector3(0, val, 0);
          scaleVertex(v, diff);
        });
      }
      if (Input.mode("SCALE_Z")) {
        Geometry.getSelected().forEach(function (v) {
          var val = (Scene.getMovementOnXZ().diff.z > 0) ? (.99 * (v.obj.position.z - center.z) - (v.obj.position.z - center.z)) : (1.01 * (v.obj.position.z - center.z) - (v.obj.position.z - center.z));
          val = (Scene.getMovementOnXZ().diff.z == 0) ? 0 : val; 
          var diff = new THREE.Vector3(0, 0, val);
          scaleVertex(v, diff);
        });
      }
    },
    onkeydown: function () {
      if (Input.mode("EDIT")) {
        if (Input.action("TOGGLE_SCALE_MODE")) {
          if (Geometry.getSelected().length > 0) {
            move = History.startMove(Geometry.getSelected());
            Input.setMode("SCALE_X");
            setAxis();
          }
        }
      } else if (active(Input.mode())) {
        if (Input.action("TOGGLE_SCALE_MODE")) {
          move.cancel();
          Input.setMode("EDIT");
        }
        if (Input.action("TOGGLE_TRANSLATE_MODE")) {
          move.confirm();
          if(Input.mode("SCALE_X")) Input.setMode("TRANSLATE_X");
          if(Input.mode("SCALE_Y")) Input.setMode("TRANSLATE_Y");
          if(Input.mode("SCALE_Z")) Input.setMode("TRANSLATE_Z");
        }
        if (Input.action("TOGGLE_ROTATE_MODE")) {
          move.confirm();
          if(Input.mode("SCALE_X")) Input.setMode("ROTATE_X");
          if(Input.mode("SCALE_Y")) Input.setMode("ROTATE_Y");
          if(Input.mode("SCALE_Z")) Input.setMode("ROTATE_Z");
        }
        if (Input.action("TOGGLE_SCALE_X")) {
          Input.setMode("SCALE_X");
        }
        if (Input.action("TOGGLE_SCALE_Y")) {
          Input.setMode("SCALE_Y");
        }
        if (Input.action("TOGGLE_SCALE_Z")) {
          Input.setMode("SCALE_Z");
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

  Input.addKeyBinding("KeyG", "TOGGLE_SCALE_MODE", "Toggle Scale Mode");
  Input.addKeyBinding("Space", "SCALE_WORLD_MOD");
  Input.addKeyBinding("KeyX", "TOGGLE_SCALE_X");
  Input.addKeyBinding("KeyY", "TOGGLE_SCALE_Y");
  Input.addKeyBinding("KeyZ", "TOGGLE_SCALE_Z");
  Input.addKeyBinding("LMB", "SCALE_CONFIRM");

  return {};

});