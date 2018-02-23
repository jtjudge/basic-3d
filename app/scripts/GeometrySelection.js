
var GeometrySelection = (function () {

  var initialized = false;

  function assertInit(val) {
    if(initialized && !val) {
      Debug.log("[GeometrySelection] ERROR: Module already initialized");
      return false;
    } else if(!initialized && val) {
      Debug.log("[GeometrySelection] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  var interface = {
    init: function(camera, renderer) {
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
            var verts = raycaster.intersectObjects(Geometry.getVertices());
            if(verts.length === 0) {
              if(!input.actions["MULT_SELECT_MOD"]) {
                Geometry.deselectAll();
              }
            } else {
              if(Geometry.getSelected().length === 0) {
                Geometry.toggleSelect(verts[0].object);
              } else {
                if (input.actions["MULT_SELECT_MOD"]) {
                  Geometry.toggleSelect(verts[0].object);
                } else {
                  Geometry.deselectAll();
                  Geometry.toggleSelect(verts[0].object);
                }
              }
            }
          }
        },
        onmode: function(input) {
          Geometry.deselectAll();
        }
      });
      KeyBindings.addKeyBinding("LMB", "SELECT_GEOM");
      KeyBindings.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
      KeyBindings.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");
    }
  };

  return interface;

})();