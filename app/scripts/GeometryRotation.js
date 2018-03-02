
Basic3D.loadModule("GeometryRotation", function (InputHandling, Scene, Geometry, History) {
  
  var SPEED = 0.04;

  var move;

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

  InputHandling.register({
    onmousedown: function (input){
      if (active(input.mode) && input.actions["ROTATE_CONFIRM"]) {
        move.confirm();
        InputHandling.mode("EDIT");
      }
    },
    onmousemove: function (input){
      if (input.mode === "ROTATE_X") {
        var center = Geometry.getCenter();
        var dx = SPEED * Scene.getMovementOnXZ(input).diff.x;
        Geometry.getSelected().forEach(function (v) {
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.sub(center);
          var newV = new THREE.Vector3(v.obj.position.x,0,0);
          var dist = Math.sqrt(Math.pow((v.obj.position.y), 2) + Math.pow((v.obj.position.z), 2));
          var theta = Math.asin((v.obj.position.y) / dist);
          if(v.obj.position.z < 0) theta = Math.PI - theta;
          newV.y = dist * Math.sin(theta + dx);
          newV.z = dist * Math.cos(theta + dx);
          v.obj.position.sub(v.obj.position);
          v.obj.position.add(newV);
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.add(center);
          v.obj.geometry.verticesNeedUpdate = true;
          v.edges.forEach(function (e) {
            e.obj.geometry.verticesNeedUpdate = true;
          });
          v.faces.forEach(function (f) {
            f.obj.geometry.verticesNeedUpdate = true;
          });
        });
      }
      if (input.mode === "ROTATE_Y") {
        var center = Geometry.getCenter();
        var dy = SPEED * Scene.getMovementOnY(input);
        Geometry.getSelected().forEach(function (v) {
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.sub(center);
          var newV = new THREE.Vector3(0,v.obj.position.y,0);
          var dist = Math.sqrt(Math.pow((v.obj.position.z), 2) + Math.pow((v.obj.position.x), 2));
          var theta = Math.asin((v.obj.position.z) / dist);
          if(v.obj.position.x < 0) theta = Math.PI - theta;
          newV.x = dist * Math.cos(theta + dy);
          newV.z = dist * Math.sin(theta + dy);
          v.obj.position.sub(v.obj.position);
          v.obj.position.add(newV);
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.add(center);
          v.obj.geometry.verticesNeedUpdate = true;
          v.edges.forEach(function (e) {
            e.obj.geometry.verticesNeedUpdate = true;
          });
          v.faces.forEach(function (f) {
            f.obj.geometry.verticesNeedUpdate = true;
          });
        });
      }
      if (input.mode === "ROTATE_Z") {
        var center = Geometry.getCenter();
        var dz = SPEED * Scene.getMovementOnXZ(input).diff.z;
        Geometry.getSelected().forEach(function (v) {
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.sub(center);
          var newV = new THREE.Vector3(0, 0, v.obj.position.z);
          var dist = Math.sqrt(Math.pow((v.obj.position.y), 2) + Math.pow((v.obj.position.x), 2));
          var theta = Math.asin((v.obj.position.x) / dist);
          if(v.obj.position.y < 0) theta = Math.PI - theta;
          newV.x = dist * Math.sin(theta + dz);
          newV.y = dist * Math.cos(theta + dz);
          v.obj.position.sub(v.obj.position);
          v.obj.position.add(newV);
          if(!input.actions["ROTATE_WORLD_MOD"]) v.obj.position.add(center);
          v.obj.geometry.verticesNeedUpdate = true;
          v.edges.forEach(function (e) {
            e.obj.geometry.verticesNeedUpdate = true;
          });
          v.faces.forEach(function (f) {
            f.obj.geometry.verticesNeedUpdate = true;
          });
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