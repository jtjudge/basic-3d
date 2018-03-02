
Basic3D.loadModule("GeometrySelection", function (InputHandling, Scene, Colors, Geometry) {

  function selectVertex(vertex) {
    vertex.selected = true;
    vertex.obj.material.color.setHex(Colors.VERTEX_SELECT);
  }

  function selectEdge(edge) {
    edge.selected = true;
    edge.obj.material.color.setHex(Colors.EDGE_SELECT);
    selectVertex(edge.v1);
    selectVertex(edge.v2);
  }

  function selectFace(face) {
    face.selected = true;
    face.obj.material.color.setHex(Colors.EDGE_SELECT);
    selectEdge(face.e1);
    selectEdge(face.e2);
    selectEdge(face.e3);
  }

  function checkEdge(edges) {
    edges.forEach(function (edge) {
      if (edge.v1.selected && edge.v2.selected) {
        edge.selected = true;
        edge.obj.material.color.setHex(Colors.EDGE_SELECT);
      } else {
        edge.selected = false;
        edge.obj.material.color.setHex(Colors.EDGE);
      }
    });
  }

  function checkFace(faces) {
    faces.forEach(function (face) {
      if (face.e1.selected && face.e2.selected && face.e3.selected) {
        face.selected = true;
        face.obj.material.color.setHex(Colors.FACE_SELECT);
      } else {
        face.selected = false;
        face.obj.material.color.setHex(Colors.FACE);
      }
    });
  }

  function toggleVertexSelect(target) {
    if(target === null) {
      return;
    }
    var vertex = Geometry.getVertices().find(function (v) {
      return v.obj.id === target.id;
    });
    vertex.selected = !vertex.selected;
    if (vertex.selected) {
      vertex.obj.material.color.setHex(Colors.VERTEX_SELECT);
    } else {
      vertex.obj.material.color.setHex(Colors.VERTEX);
    }
    checkEdge(vertex.edges);
    checkFace(vertex.faces);
  }

  function toggleEdgeSelect(target) {
    if(target === null) {
      return;
    }
    var edge = Geometry.getEdges().find(function (v) {
      return v.obj.id == target.id;
    });
    edge.selected = !edge.selected;
    if(edge.selected){
      edge.obj.material.color.setHex(Colors.EDGE_SELECT);
    } else {
      edge.obj.material.color.setHex(Colors.EDGE);
    }
    selectEdge(edge);
    checkFace(edge.v1.faces);
  }

  function toggleFaceSelect(target) {
    if(target === null) {
      return;
    }
    var face = Geometry.getFaces().find(function (v) {
      return v.obj.id == target.id;
    });
    face.selected = !face.selected;
    if(face.selected){
      face.obj.material.color.setHex(Colors.EDGE_SELECT);
    } else {
      face.obj.material.color.setHex(Colors.EDGE);
    }
    selectFace(face);
  }

  function deselectAll() {
    Geometry.getVertices().forEach(function (vertex) {
      vertex.selected = false;
      vertex.obj.material.color.setHex(Colors.VERTEX);
    });
    Geometry.getEdges().forEach(function (edge) {
      edge.selected = false;
      edge.obj.material.color.setHex(Colors.EDGE);
    });
    Geometry.getFaces().forEach(function (face) {
      face.selected = false;
      face.obj.material.color.setHex(Colors.FACE);
    });
  }

  InputHandling.register({
    onmousedown: function (input) {
      if (input.mode === "EDIT" && input.actions["SELECT_GEOM"]) {
        var targets = Geometry.getVertices().map(function (v) {
          return v.obj;
        });
        var eTargets = Geometry.getEdges().map(function (v) {
          return v.obj;
        });
        var fTargets = Geometry.getFaces().map(function (v) {
          return v.obj;
        });
        var hits = Scene.intersectObjects(input, targets);
        var eHits = Scene.intersectObjects(input, eTargets);
        var fHits = Scene.intersectObjects(input, fTargets);

        if (hits.length === 0 && eHits.length === 0 && fHits.length === 0) {
            if (!input.actions["MULT_SELECT_MOD"]) {
            deselectAll();
          }
        } else if(hits.length !== 0){
          if (Geometry.getSelected().length === 0) {
            toggleVertexSelect(hits[0].object);
          } else {
            if (input.actions["MULT_SELECT_MOD"]) {
              toggleVertexSelect(hits[0].object);
            } else {
              deselectAll();
              toggleVertexSelect(hits[0].object);
            }
          }
        } else if(eHits.length !== 0){
          if (Geometry.getSelected().length === 0) {
            toggleEdgeSelect(eHits[0].object);
          } else {
            if (input.actions["MULT_SELECT_MOD"]) {
              toggleEdgeSelect(eHits[0].object);
            } else {
              deselectAll();
              toggleEdgeSelect(eHits[0].object);
            }
          }
        } else if(fHits.length !== 0){
          if (Geometry.getSelected().length === 0) {
            toggleFaceSelect(fHits[0].object);
          } else {
            if (input.actions["MULT_SELECT_MOD"]) {
              toggleFaceSelect(fHits[0].object);
            } else {
              deselectAll();
              toggleFaceSelect(fHits[0].object);
            }
          }
        }
      }
    }
  });

  InputHandling.addKeyBinding("LMB", "SELECT_GEOM");
  InputHandling.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
  InputHandling.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");

  return {};

});
