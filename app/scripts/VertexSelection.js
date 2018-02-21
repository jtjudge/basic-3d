
var VertexSelection = (function () {
  
  var initialized = false;
  var selected = [];

  var SELECT_COLOR = 0xff0000;
  var DESELECT_COLOR = 0xffffff;

  function toggleSelect(obj) {
    var index = selected.findIndex(function(v) {
      return v.id === obj.id;
    });
    if (index !== -1) {
      selected.splice(index, 1)[0];
      obj.material.color.setHex(DESELECT_COLOR);
    } else {
      selected.push(obj);
      obj.material.color.setHex(SELECT_COLOR);
    }
  }

  function deselectAll() {
    selected.forEach(function(obj) {
      obj.material.color.setHex(DESELECT_COLOR);
    });
    selected = [];
  }

  function assertInit(val) {
    if(initialized && !val) {
      Debug.log("[VertexSelection] ERROR: Module already initialized");
      return false;
    } else if(!initialized && val) {
      Debug.log("[VertexSelection] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  var interface = {
    init: function(vertices, camera, renderer) {
      if(!assertInit(false)) return;
      initialized = true;
      InputHandling.register({
        onmousedown: function(input) {
          if (input.mode === "EDIT" && input.actions["SELECT_GEOM"]) {
            var mouse = new THREE.Vector3(
              (input.coords.x2 / renderer.getSize().width) * 2 - 1,
              -(input.coords.y2 / renderer.getSize().height) * 2 + 1,
              0.5
            );
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            var verts = raycaster.intersectObjects(vertices);
            if(verts.length === 0) {
              if(!input.actions["MULT_SELECT_MOD"])
                deselectAll();
            } else {
              if(selected.length === 0) {
                toggleSelect(verts[0].object);
              } else {
                if (input.actions["MULT_SELECT_MOD"]) {
                  toggleSelect(verts[0].object);
                } else {
                  deselectAll();
                  toggleSelect(verts[0].object);
                }
              }
            }
          }
        },
        onmode: function(input) {
          deselectAll();
        }
      });
      KeyBindings.addKeyBinding("LMB", "SELECT_GEOM");
      KeyBindings.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
      KeyBindings.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");
    },
    getSelected: function() {
      if(!assertInit(true)) return;
      return selected;
    }
  };

  return interface;

})();