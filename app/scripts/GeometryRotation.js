
Basic3D.loadModule("GeometryRotation", function (InputHandling, Scene, Geometry, History) {
  
  var SPEED = 0.04;

  var move, center;

  function active(mode){
    return (mode === "ROTATE_X" ||
      mode === "ROTATE_Y" ||
      mode === "ROTATE_Z");
  }

  function setAxis(input) {
    center = input.actions["ROTATE_WORLD_MOD"] ? 
      new THREE.Vector3(0, 0, 0) : Geometry.getCenter();
    if (input.mode === "ROTATE_X") {
      Scene.showX(center);
    }
    if (input.mode === "ROTATE_Y") {
      Scene.showY(center);
    }
    if (input.mode === "ROTATE_Z") {
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

  InputHandling.register({
    onmousedown: function (input){
      if (active(input.mode) && input.actions["ROTATE_CONFIRM"]) {
        move.confirm();
        InputHandling.mode("EDIT");
      }
    },
    onmousemove: function (input) {
      if (input.mode === "ROTATE_X") {
        var axis = new THREE.Vector3(1, 0, 0);
        var angle = SPEED * Scene.getMovementOnXZ(input).diff.x;
        Geometry.getSelected().forEach(function (v) {
          rotateVertex(v, axis, angle);
        });
      }
      if (input.mode === "ROTATE_Y") {
        var axis = new THREE.Vector3(0, 1, 0);
        var angle = SPEED * Scene.getMovementOnY(input);
        Geometry.getSelected().forEach(function (v) {
          rotateVertex(v, axis, angle);
        });
      }
      if (input.mode === "ROTATE_Z") {
        var axis = new THREE.Vector3(0, 0, 1);
        var angle = SPEED * Scene.getMovementOnXZ(input).diff.z;
        Geometry.getSelected().forEach(function (v) {
          rotateVertex(v, axis, angle);
        });
      }
    },
    onkeydown: function (input){
      if (input.actions["TOGGLE_ROTATE_MODE"]) {
        if (!active(input.mode)) {
          if (Geometry.getSelected().length === 0) {
            InputHandling.mode("EDIT");
          } else {
            if(input.mode === "EDIT") {
              move = History.startMove(Geometry.getSelected());
              InputHandling.mode("ROTATE_X");
              setAxis(input);
            }
          }
        } else {
          move.cancel();
          InputHandling.mode("EDIT");
        }
      } else if (active(input.mode)) {
        if (input.actions["TOGGLE_ROTATE_X"]) {
          InputHandling.mode("ROTATE_X");
        }
        if (input.actions["TOGGLE_ROTATE_Y"]) {
          InputHandling.mode("ROTATE_Y");
        }
        if (input.actions["TOGGLE_ROTATE_Z"]) {
          InputHandling.mode("ROTATE_Z");
        }
        setAxis(input);
      }
    },
    onkeyup: function(input) {
      if(active(input.mode)) {
        setAxis(input);
      }
    }
  });

  InputHandling.addKeyBinding("KeyR", "TOGGLE_ROTATE_MODE");
  InputHandling.addKeyBinding("Space", "ROTATE_WORLD_MOD");
  InputHandling.addKeyBinding("KeyX", "TOGGLE_ROTATE_X");
  InputHandling.addKeyBinding("KeyY", "TOGGLE_ROTATE_Y");
  InputHandling.addKeyBinding("KeyZ", "TOGGLE_ROTATE_Z");
  InputHandling.addKeyBinding("LMB", "ROTATE_CONFIRM");

  return {};

});