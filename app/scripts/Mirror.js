
Basic3D.loadModule("Mirror", function(Input, Scene, Geometry, Selection, History, TipsDisplay, EditMenu) {

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
    if(Input.mode("MIRROR_X")) {
      v.obj.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    }
    if(Input.mode("MIRROR_Y")) {
      v.obj.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    }
    if(Input.mode("MIRROR_Z")) {
      v.obj.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
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
        if(Input.action("TOGGLE_ROTATE_MODE")){
          move.confirm();
          if(Input.mode("MIRROR_X")) Input.setMode("ROTATE_X");
          if(Input.mode("MIRROR_Y")) Input.setMode("ROTATE_Y");
          if(Input.mode("MIRROR_Z")) Input.setMode("ROTATE_Z");
        }
        if(Input.action("TOGGLE_SCALE_MODE")){
          move.confirm();
          if(Input.mode("MIRROR_X")) Input.setMode("SCALE_X");
          if(Input.mode("MIRROR_Y")) Input.setMode("SCALE_Y");
          if(Input.mode("MIRROR_Z")) Input.setMode("SCALE_Z");
        }
        if(Input.action("TOGGLE_TRANSLATE_MODE")){
          move.confirm();
          if(Input.mode("MIRROR_X")) Input.setMode("TRANSLATE_X");
          if(Input.mode("MIRROR_Y")) Input.setMode("TRANSLATE_Y");
          if(Input.mode("MIRROR_Z")) Input.setMode("TRANSLATE_Z");
        }
        if(Input.action("TOGGLE_MIRROR_X")){
          Input.setMode("MIRROR_X");
          setAxis();
          Geometry.getSelected().forEach(function(v) {
            mirrorVertex(v);
          });
        }
        if(Input.action("TOGGLE_MIRROR_Y")){
          Input.setMode("MIRROR_Y");
          setAxis();
          Geometry.getSelected().forEach(function(v) {
            mirrorVertex(v);
          });
        }
        if(Input.action("TOGGLE_MIRROR_Z")){
          Input.setMode("MIRROR_Z");
          setAxis();
          Geometry.getSelected().forEach(function(v) {
            mirrorVertex(v);
          });
        }
        setAxis();
      }
    },

    onkeyup: function() {
      if(active(Input.mode())) setAxis();
    },

    onmode: function() {
      if(active(Input.mode())) {
        if(move === undefined || move.done()) {
          move = History.startMove(Geometry.getSelected());
        }
        setAxis();
      }
    }

  });

  Input.addKeyBinding("KeyM", "TOGGLE_MIRROR_MODE", "Toggle Mirror Mode");
  Input.addKeyBinding("Space", "MIRROR_WORLD_MOD");
  Input.addKeyBinding("KeyX", "TOGGLE_MIRROR_X");
  Input.addKeyBinding("KeyY", "TOGGLE_MIRROR_Y");
  Input.addKeyBinding("KeyZ", "TOGGLE_MIRROR_Z");
  Input.addKeyBinding("LMB", "MIRROR_CONFIRM");

  TipsDisplay.registerMode({
    name: "MIRROR",
    mapped: ["MIRROR_X", "MIRROR_Y", "MIRROR_Z"],
    display: "Mirror"
  });

  TipsDisplay.registerTip({
    mode: "MIRROR",
    builder: function(get) {
      return `${get("TOGGLE_MIRROR_MODE")} to cancel`;
    }
  });

  TipsDisplay.registerTip({
    mode: "MIRROR",
    builder: function(get) {
      return `${get("MIRROR_CONFIRM")} to confirm`;
    }
  });

  TipsDisplay.registerTip({
    mode: "MIRROR",
    builder: function(get) {
      var x = get("TOGGLE_MIRROR_X");
      var y = get("TOGGLE_MIRROR_Y");
      var z = get("TOGGLE_MIRROR_Z");
      return `${x}, ${y}, or ${z} to swap axis`;
    }
  });

  TipsDisplay.registerTip({
    mode: "MIRROR",
    builder: function(get) {
      return `${get("MIRROR_WORLD_MOD")} for origin`
    },
    condition: function() {
      return !Input.action("MIRROR_WORLD_MOD");
    }
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function(get) {
      return `${get("TOGGLE_MIRROR_MODE")} to mirror`;
    },
    condition: function() {
      return Geometry.getSelected().length > 0;
    }
  });

  EditMenu.registerComponent(function() {
    var button = document.createElement("div");
    button.className = "btn edit-menu-btn";
    button.innerHTML = "Mirror";
    button.onclick = function() {
      console.log("MIRROR");
    };

    return {
      parent: "TransformMenu",
      name: "MirrorButton",
      element: button,
      update: function() {
        if(Geometry.getSelected().length > 0) {
          button.style.display = "block";
        }
        else {
          button.style.display = "none";
        }
      }
    };
  });

  return{};

});
