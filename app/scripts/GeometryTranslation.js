
Basic3D.loadModule("GeometryTranslation", function (Debug, Geometry, InputHandling, AxisHelper) {

  var initialized = false;

  let scene;

  const SPEED = 0.05;

  function assertInit(val) {
    if (initialized && !val) {
      Debug.log("[GeometryTranslation] ERROR: Module already initialized");
      return false;
    } else if (!initialized && val) {
      Debug.log("[GeometryTranslation] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  function active(mode) {
    return (mode === "TRANSLATE_MODE" ||
      mode === "TRANSLATE_X" ||
      mode === "TRANSLATE_Y" ||
      mode === "TRANSLATE_Z");
  }

  function translateVertex(v, diff) {
    // Update vertex position
    v.obj.geometry.vertices[0].add(diff);
    v.obj.geometry.verticesNeedUpdate = true;
    // Update any connected edges
    v.edges.forEach(function (e) {
      var index = (v.obj.id === e.v1.obj.id) ? 0 : 
        (v.obj.id === e.v2.obj.id) ? 1 : -1;
      if(index > -1) {
        e.obj.geometry.vertices[index].add(diff);
        e.obj.geometry.verticesNeedUpdate = true;
      }
    });
    // Update any connected faces
    v.faces.forEach(function (f) {
      var index = (v.obj.id === f.v1.obj.id) ? 0 : 
        (v.obj.id === f.v2.obj.id) ? 1 : 
        (v.obj.id === f.v3.obj.id) ? 2 : -1;
      if (index > -1) {
        f.obj.geometry.vertices[index].add(diff);
        f.obj.geometry.verticesNeedUpdate = true;
      }
    });
  }

  var interface = {
    init: function (camera, renderer, scene_) {
      if (!assertInit(false)) return;
      initialized = true;
      scene = scene_;
      InputHandling.register({
        onmousedown: function (input) {
          if (active(input.mode) && input.actions["TRANSLATE_CONFIRM"]) {
            Debug.log("TRANSLATION CONFIRMED");
            InputHandling.mode("EDIT");
          }
        },
        onmousemove: function (input) {
          if (input.mode === "TRANSLATE_X") {
            Geometry.getSelected().forEach(function (v) {
              translateVertex(v, new THREE.Vector3(
                SPEED * (input.coords.y2 - input.coords.y1), 0, 0
              ));
            });
          }
          if (input.mode === "TRANSLATE_Y") {
            Geometry.getSelected().forEach(function (v) {
              translateVertex(v, new THREE.Vector3(
                0, SPEED * (input.coords.y1 - input.coords.y2), 0
              ));
            });
          }
          if (input.mode === "TRANSLATE_Z") {
            Geometry.getSelected().forEach(function (v) {
              translateVertex(v, new THREE.Vector3(
                0, 0, SPEED * (input.coords.y2 - input.coords.y1)
              ));
            });
          }
        },
        onkeydown: function (input) {
          if (input.actions["TOGGLE_TRANSLATE_MODE"]) {
            if (!active(input.mode)) {
              InputHandling.mode("TRANSLATE_MODE");
              if (Geometry.getSelected().length === 0) {
                Debug.log("NO SELECTION");
                InputHandling.mode("EDIT");
              }
            } else {
              // To do: Reset geometry
              Debug.log("TRANSLATION CANCELLED");
              InputHandling.mode("EDIT");
            }
          } else if (active(input.mode)) {
            if (input.actions["TOGGLE_TRANSLATE_X"]) {
              InputHandling.mode("TRANSLATE_X");
            }
            if (input.actions["TOGGLE_TRANSLATE_Y"]) {
              InputHandling.mode("TRANSLATE_Y");
            }
            if (input.actions["TOGGLE_TRANSLATE_Z"]) {
              InputHandling.mode("TRANSLATE_Z");
            }
          }
        },
        onmode: function (input) {
          if (input.mode === "TRANSLATE_X") {
            AxisHelper.setX(Geometry.getCenter());
          }
          if (input.mode === "TRANSLATE_Y") {
            AxisHelper.setY(Geometry.getCenter());
          }
          if (input.mode === "TRANSLATE_Z") {
            AxisHelper.setZ(Geometry.getCenter());
          }
        }
      });

      InputHandling.addKeyBinding("KeyT", "TOGGLE_TRANSLATE_MODE");
      InputHandling.addKeyBinding("KeyX", "TOGGLE_TRANSLATE_X");
      InputHandling.addKeyBinding("KeyY", "TOGGLE_TRANSLATE_Y");
      InputHandling.addKeyBinding("KeyZ", "TOGGLE_TRANSLATE_Z");
      InputHandling.addKeyBinding("LMB", "TRANSLATE_CONFIRM");
    }
  };

  return interface;
});
