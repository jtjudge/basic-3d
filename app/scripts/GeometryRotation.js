
Basic3D.loadModule("GeometryRotation", function (InputHandling, Scene, Geometry, History) {
  
  var SPEED = 0.04;

  var move;

  var center;

  function active(mode){
    return (mode === "ROTATE_MODE" ||
      mode === "ROTATE_X" ||
      mode === "ROTATE_Y" ||
      mode === "ROTATE_Z");
  }

  function setAxis(input) {
    var point = (input.actions["ROTATE_WORLD_MOD"]) ? 
      new THREE.Vector3(0, 0, 0) : Geometry.getCenter();
    if (input.mode === "ROTATE_X") {
      Scene.showX(point);
    }
    if (input.mode === "ROTATE_Y") {
      Scene.showY(point);
    }
    if (input.mode === "ROTATE_Z") {
      Scene.showZ(point);
    }
  }

  function getNewCoords(x, y, d){
    var coords = [0, 0];
    var dist = Math.sqrt(Math.pow((x), 2) + Math.pow((y), 2));
    var theta = Math.asin((x) / dist);
    if(y < 0) theta = Math.PI - theta;
    coords[0] = dist * Math.sin(theta + d);
    coords[1] = dist * Math.cos(theta + d);
    return coords;
  }

  function updateVertex(v){
    v.obj.geometry.verticesNeedUpdate = true;
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
    onmousemove: function (input){
      if (input.mode === "ROTATE_X") {
        var dx = SPEED * Scene.getMovementOnXZ(input).diff.x;
        Geometry.getSelected().forEach(function (v) {
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.sub(center);
          var coords = getNewCoords(v.obj.position.y, v.obj.position.z, dx);
          var newV = new THREE.Vector3(v.obj.position.x,coords[0], coords[1]);
          v.obj.position.sub(v.obj.position);
          v.obj.position.add(newV);
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.add(center);
          updateVertex(v);
        });
      }
      if (input.mode === "ROTATE_Y") {
        var dy = SPEED * Scene.getMovementOnY(input);
        Geometry.getSelected().forEach(function (v) {
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.sub(center);
          var coords = getNewCoords(v.obj.position.z, v.obj.position.x, dy);
          var newV = new THREE.Vector3(coords[1],v.obj.position.y,coords[0]);
          v.obj.position.sub(v.obj.position);
          v.obj.position.add(newV);
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.add(center);
          updateVertex(v);
        });
      }
      if (input.mode === "ROTATE_Z") {
        var dz = SPEED * Scene.getMovementOnXZ(input).diff.z;
        Geometry.getSelected().forEach(function (v) {
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.sub(center);
          var coords = getNewCoords(v.obj.position.x, v.obj.position.y, dz);
          var newV = new THREE.Vector3(coords[0], coords[1], v.obj.position.z);
          v.obj.position.sub(v.obj.position);
          v.obj.position.add(newV);
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.add(center);
          updateVertex(v);
        });
      }
    },
    onkeydown: function (input){
      if (input.actions["TOGGLE_ROTATE_MODE"]) {
        if (!active(input.mode)) {
          if (Geometry.getSelected().length <= 1) {
            InputHandling.mode("EDIT");
          } else {
            move = History.startMove(Geometry.getSelected());
            InputHandling.mode("ROTATE_MODE");
          }
        } else {
          move.cancel();
          InputHandling.mode("EDIT");
        }
      } else if (active(input.mode)) {
        if (input.actions["TOGGLE_ROTATE_X"]) {
          if(!(input.mode === "ROTATE_X")){
            center = Geometry.getCenter();
          }
          InputHandling.mode("ROTATE_X");
        }
        if (input.actions["TOGGLE_ROTATE_Y"]) {
          if(!(input.mode === "ROTATE_Y")){
            center = Geometry.getCenter();
          }
          InputHandling.mode("ROTATE_Y");
        }
        if (input.actions["TOGGLE_ROTATE_Z"]) {
          if(!(input.mode === "ROTATE_Z")){
            center = Geometry.getCenter();
          }
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