
Basic3D.loadModule("GeometryTranslation", function (Debug, Geometry, History, InputHandling, AxisHelper) {

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
    v.obj.position.add(diff);
    v.edges.forEach(function (e) {
      e.obj.geometry.verticesNeedUpdate = true;
    });
    v.faces.forEach(function (f) {
      f.obj.geometry.verticesNeedUpdate = true;
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
              if (Geometry.getSelected().length === 0) {
                InputHandling.mode("EDIT");
              } else {
                InputHandling.mode("TRANSLATE_MODE");
              }
            } else {
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
