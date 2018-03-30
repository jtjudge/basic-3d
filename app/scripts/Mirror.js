
Basic3D.loadModule("Mirror", function(Input, Scene, Geometry, Selection, Rotation, History, TipsDisplay, EditMenu) {

  var center;
  var move;

  function active(mode) {
    return mode === "MIRROR_X"
      || mode === "MIRROR_Y"
      || mode === "MIRROR_Z"
      || mode === "MIRROR_MODE";
  }

  function setAxis() {
    center = Input.action("MIRROR_WORLD_MOD") ?
      new THREE.Vector3(0,0,0) : Geometry.getCenter();

    if (Input.mode("MIRROR_X")) {
      Scene.showX(center);
    }
    if(Input.mode("MIRROR_Y")) {
      Scene.showY(center);
    }
    if(Input.mode("MIRROR_Z")) {
      Scene.showZ(center);
    }
  }

  function mirrorVertex(v) {
    if(Input.mode("MIRROR_X") {
      v.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    }
    if(Input.mode("MIRROR_Y")) {
      v.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    }
    if(Input.mode("MIRROR_Z")) {
      v.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    }

    v.edges.forEach(function(e) {
      e.obj.geometry.verticesNeedUpdate = true;
    });
    v.faces.forEach(function(f) {
      f.obj.geometry.verticesNeedUpdate = true;
    });
  }

  Input.register({
    onmousedown: function() {
      if(active(Input.mode()) && Input.action("MIRROR_CONFIRM")) {
        move.confirm();
        Input.setMode("EDIT");
      }
    },

    onkeydown: function() {
      if(Input.mode("EDIT")) {
        if(Input.action("TOGGLE_MIRROR_MODE")){
          if(Geometry.getSelected().length > 0) {
            move = History.startMove(Geometry.getSelected());
            //This is designed to not mirror immediately after toggling mirror mode
            Input.setMode("MIRROR_X");
            setAxis();
          }
        }
      }
      else if(active(Input.mode())) {
        if(Input.action("TOGGLE_MIRROR_MODE")){
          move.cancel();
          Input.setMode("EDIT");
        }
      }
    }
  })

})
