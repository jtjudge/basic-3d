
Basic3D.loadModule("GeometryTranslation", function (Debug, Geometry, InputHandling, AxisHelper){

  var initialized = false;

  var selected = [];
  var edges = [];
  var faces = [];

  let scene;

  function assertInit(val) {
    if(initialized && !val) {
      Debug.log("[GeometryTranslation] ERROR: Module already initialized");
      return false;
    } else if(!initialized && val) {
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

  var interface = {
    init: function(camera, renderer, scene_) {
      if(!assertInit(false)) return;
      initialized = true;
      scene = scene_;
      InputHandling.register({
        onmousedown: function(input){
          if(active(input.mode) && input.actions["TRANSLATE_CONFIRM"]) {
            Debug.log("CONFIRMED");
            InputHandling.mode("EDIT");
          }
        },
        onmousemove: function(input) {
          if(input.mode === "TRANSLATE_X") {
            selected.forEach(function (v){
                v.obj.geometry.translate(-0.10 * (input.coords.y2 - input.coords.y1), 0, 0);
                v.obj.geometry.verticesNeedUpdate = true;
                edges.forEach(function (e) {
                    if(v.obj.id === e.v1.obj.id){
                        e.obj.geometry.vertices[0].x += -0.10 * (input.coords.y2 - input.coords.y1);
                        e.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === e.v2.obj.id){
                        e.obj.geometry.vertices[1].x += -0.10 * (input.coords.y2 - input.coords.y1);
                        e.obj.geometry.verticesNeedUpdate = true;
                    }
                });
                faces.forEach(function (f) {
                    if(v.obj.id === f.v1.obj.id){
                        f.obj.geometry.vertices[0].x += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === f.v2.obj.id){
                        f.obj.geometry.vertices[1].x += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === f.v3.obj.id){
                        f.obj.geometry.vertices[2].x += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    }
                });
            });
            Debug.log("X");
          }
          if(input.mode === "TRANSLATE_Y") {
            selected.forEach(function (v){
                v.obj.geometry.translate(0, -0.10 * (input.coords.y2 - input.coords.y1), 0);
                v.obj.geometry.verticesNeedUpdate = true;
                edges.forEach(function (e) {
                    if(v.obj.id === e.v1.obj.id){
                        e.obj.geometry.vertices[0].y += -0.10 * (input.coords.y2 - input.coords.y1);
                        e.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === e.v2.obj.id){
                        e.obj.geometry.vertices[1].y += -0.10 * (input.coords.y2 - input.coords.y1);
                        e.obj.geometry.verticesNeedUpdate = true;
                    }
                });
                faces.forEach(function (f) {
                    if(v.obj.id === f.v1.obj.id){
                        f.obj.geometry.vertices[0].y += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === f.v2.obj.id){
                        f.obj.geometry.vertices[1].y += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === f.v3.obj.id){
                        f.obj.geometry.vertices[2].y += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    }
                });
            });
            Debug.log("Y");
          }
          if(input.mode === "TRANSLATE_Z") {
            selected.forEach(function (v){
                v.obj.geometry.translate(0, 0,  -0.10 * (input.coords.y2 - input.coords.y1));
                v.obj.geometry.verticesNeedUpdate = true;
                edges.forEach(function (e) {
                    if(v.obj.id === e.v1.obj.id){
                        e.obj.geometry.vertices[0].z += -0.10 * (input.coords.y2 - input.coords.y1);
                        e.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === e.v2.obj.id){
                        e.obj.geometry.vertices[1].z += -0.10 * (input.coords.y2 - input.coords.y1);
                        e.obj.geometry.verticesNeedUpdate = true;
                    }
                });
                faces.forEach(function (f) {
                    if(v.obj.id === f.v1.obj.id){
                        f.obj.geometry.vertices[0].z += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === f.v2.obj.id){
                        f.obj.geometry.vertices[1].z += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    } else if(v.obj.id === f.v3.obj.id){
                        f.obj.geometry.vertices[2].z += -0.10 * (input.coords.y2 - input.coords.y1);
                        f.obj.geometry.verticesNeedUpdate = true;
                    }
                });
            });
            Debug.log("Z");
          }
        },
        onkeydown: function(input) {
          if(input.actions["TOGGLE_TRANSLATE_MODE"]){
            if(!active(input.mode)) {
              InputHandling.mode("TRANSLATE_MODE");
            } else {
              // To do: Reset geometry
              Debug.log("CANCELLED");
              InputHandling.mode("EDIT");
            }
          } else if(active(input.mode)) {
            if(input.actions["TOGGLE_TRANSLATE_X"]){
              InputHandling.mode("TRANSLATE_X");
            }
            if(input.actions["TOGGLE_TRANSLATE_Y"]){
              InputHandling.mode("TRANSLATE_Y");
            }
            if(input.actions["TOGGLE_TRANSLATE_Z"]){
              InputHandling.mode("TRANSLATE_Z");
            }
          }
        },
        onmode: function(input) {
          Debug.log(input.mode);
          if(!active(input.mode)) {
            selected = null;
            AxisHelper.setNone(scene);
          }
          if(input.mode === "TRANSLATE_MODE") {
            if(!selected) {
              selected = Geometry.getVertices().filter(function(v) {
                return v.selected;
              });
            }
            if(selected.length === 0) {
              Debug.log("NO SELECTION");
              InputHandling.mode("EDIT");
            } else {
                selected.forEach(function (v){
                    var se = [];
                    se = Geometry.getEdges().filter(function (e) {
                        if(v.obj.id === e.v1.obj.id || v.obj.id === e.v2.obj.id) return true;
                        return false;
                    });
                    edges = edges.concat(se);
                    var fe = [];
                    fe = Geometry.getFaces().filter(function (f) {
                        if(v.obj.id === f.v1.obj.id || v.obj.id === f.v2.obj.id || v.obj.id === f.v3.obj.id) return true;
                        return false;
                    });
                    faces = faces.concat(fe);
                    Debug.log(faces.length + "");
                });
            }

          }
          if(input.mode === "TRANSLATE_X") {
            AxisHelper.setX(scene);
          }
          if(input.mode === "TRANSLATE_Y") {
            AxisHelper.setY(scene);
          }
          if(input.mode === "TRANSLATE_Z") {
            AxisHelper.setZ(scene);
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
