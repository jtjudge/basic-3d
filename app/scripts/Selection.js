
Basic3D.loadModule("Selection", function (Input, Scene, Colors, Geometry, TipsDisplay) {

  function updateConnected(vert) {
    vert.edges.forEach(function (e) {
      e.selected = e.v1.selected && e.v2.selected;
      e.obj.material.color.set((e.selected) ? Colors.EDGE_SELECT : Colors.EDGE);
    });
    vert.faces.forEach(function (f) {
      f.selected = f.v1.selected && f.v2.selected && f.v3.selected;
      f.obj.material.color.set((f.selected) ? Colors.FACE_SELECT : Colors.FACE);
    });
  }

  function updateVertex(target, value) {
    target.selected = value;
    target.obj.material.color.set((value) ? Colors.VERTEX_SELECT : Colors.VERTEX);
    updateConnected(target);
  }

  function updateTarget(target, value) {
    if (!target.v1) updateVertex(target, value);
    if (target.v1) updateVertex(target.v1, value);
    if (target.v2) updateVertex(target.v2, value);
    if (target.v3) updateVertex(target.v3, value);
    setDisplay();
  }

  function updateAll(value) {
    Geometry.getVertices().forEach(function (vertex) {
      vertex.selected = value;
      vertex.obj.material.color.set((value) ? Colors.VERTEX_SELECT : Colors.VERTEX);
    });
    Geometry.getEdges().forEach(function (edge) {
      edge.selected = value;
      edge.obj.material.color.set((value) ? Colors.EDGE_SELECT : Colors.EDGE);
    });
    Geometry.getFaces().forEach(function (face) {
      face.selected = value;
      face.obj.material.color.set((value) ? Colors.FACE_SELECT : Colors.FACE);
    });
    setDisplay();
  }

  function performSelection(arr) {
    var targets = Scene.intersectObjects(
      arr.map(function (o) {
        return o.obj;
      })
    ).map(function (obj) {
      return arr.find(function (o) {
        return o.obj.id === obj.object.id;
      });
    });
    if(targets.length > 0) {
      if (Input.action("MULT_SELECT_MOD")) {
        updateTarget(targets[0], !targets[0].selected);
      } else {
        updateAll(false);
        updateTarget(targets[0], !targets[0].selected);
      }
      return true;
    }
    return false;
  }

  function setDisplay() {
    TipsDisplay.set("Edit", function() {
      if (Geometry.getSelected().length > 0) {
        return "V for new vertex, T to translate, R to rotate, G to scale";
      } else {
        return "V for new vertex";
      }
    });
  }

  Input.register({
    onmousedown: function () {
      if (Input.mode("EDIT") && Input.action("SELECT_GEOM")) {
        if(performSelection(Geometry.getVertices())) return;
        if(performSelection(Geometry.getEdges())) return;
        if(performSelection(Geometry.getFaces())) return;
        if (!Input.action("MULT_SELECT_MOD")) updateAll(false);
      }
    },
    onmode: function () {
      if (Input.mode("EDIT")) setDisplay();
    }
  });

  Input.addKeyBinding("LMB", "SELECT_GEOM");
  Input.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
  Input.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");

  return {
    toggleSelection: updateTarget
  };

});
