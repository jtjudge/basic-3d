
Basic3D.loadModule("Mirror", function(Input, Scene, Geometry, Selection, Rotation, History, TipsDisplay, EditMenu) {

  var center;

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
            Input.setMode("MIRROR_MODE");
          }
        }
      }
    }
  })

})
