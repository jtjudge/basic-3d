
Basic3D.loadModule("GeometrySelection", function (Debug, Geometry, InputHandling) {

  var initialized = false;

  function assertInit(val) {
    if (initialized && !val) {
      Debug.log("[GeometrySelection] ERROR: Module already initialized");
      return false;
    } else if (!initialized && val) {
      Debug.log("[GeometrySelection] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  function toggleSelect(target) {
    var vertex = Geometry.getVertices().find(function (v) {
      return v.obj.id === target.id;
    });
    vertex.selected = !vertex.selected;
    if (vertex.selected) {
      vertex.obj.material.color.setHex(Geometry.getColors().VERTEX_SELECT);
    } else {
      vertex.obj.material.color.setHex(Geometry.getColors().VERTEX);
    }
    vertex.edges.forEach(function (edge) {
      if (edge.v1.selected && edge.v2.selected) {
        edge.selected = true;
        edge.obj.material.color.setHex(Geometry.getColors().EDGE_SELECT);
      } else {
        edge.selected = false;
        edge.obj.material.color.setHex(Geometry.getColors().EDGE);
      }
    });
    vertex.faces.forEach(function (face) {
      if (face.v1.selected && face.v2.selected && face.v3.selected) {
        face.selected = true;
        face.obj.material.color.setHex(Geometry.getColors().FACE_SELECT);
      } else {
        face.selected = false;
        face.obj.material.color.setHex(Geometry.getColors().FACE);
      }
    });
  }

  function deselectAll() {
    Geometry.getVertices().forEach(function (vertex) {
      vertex.selected = false;
      vertex.obj.material.color.setHex(Geometry.getColors().VERTEX);
    });
    Geometry.getEdges().forEach(function (edge) {
      edge.selected = false;
      edge.obj.material.color.setHex(Geometry.getColors().EDGE);
    });
    Geometry.getFaces().forEach(function (face) {
      face.selected = false;
      face.obj.material.color.setHex(Geometry.getColors().FACE);
    });
  }

  var interface = {
    init: function (camera, renderer) {
      if (!assertInit(false)) return;
      initialized = true;
      InputHandling.register({
        onmousedown: function (input) {
          if (input.mode === "EDIT" && input.actions["SELECT_GEOM"]) {
            var mouse = new THREE.Vector3(
              (input.coords.x2 / renderer.getSize().width) * 2 - 1,
              -(input.coords.y2 / renderer.getSize().height) * 2 + 1,
              0.5
            );
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            var targets = Geometry.getVertices().map(function (v) {
              return v.obj;
            });
            var hits = raycaster.intersectObjects(targets);
            if (hits.length === 0) {
              if (!input.actions["MULT_SELECT_MOD"]) {
                deselectAll();
              }
            } else {
              if (Geometry.getSelected().length === 0) {
                toggleSelect(hits[0].object);
              } else {
                if (input.actions["MULT_SELECT_MOD"]) {
                  toggleSelect(hits[0].object);
                } else {
                  deselectAll();
                  toggleSelect(hits[0].object);
                }
              }
            }
          }
        }
      });
      InputHandling.addKeyBinding("LMB", "SELECT_GEOM");
      InputHandling.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
      InputHandling.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");
    }
  };

  return interface;

});