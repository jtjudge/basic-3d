
Basic3D.loadModule("Selection", function (Input, Scene, Colors, Geometry, TipsDisplay, EditMenu) {

  var mode = "VERTEX";

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
  }

  function updateVertex(vert, value) {
    vert.selected = value;
    vert.obj.material.color.set((vert.selected) ? Colors.VERTEX_SELECT : Colors.VERTEX);
    if (mode !== "VERTEX") return;
    vert.edges.forEach(function (e) {
      updateEdge(e, e.vertices().every(function (v) { return v.selected; }));
    });
    vert.faces.forEach(function (f) {
      updateFace(f, f.vertices().every(function (v) { return v.selected; }));
    });
  }

  function updateEdge(edge, value) {
    edge.selected = value;
    edge.obj.material.color.set((edge.selected) ? Colors.EDGE_SELECT : Colors.EDGE);
    if (mode !== "EDGE") return;
    edge.vertices().forEach(function (v) {
      updateVertex(v, v.edges.some(function (e) { return e.selected; }));
    });
    edge.faces().forEach(function (f) {
      updateFace(f, f.edges().every(function (e) { return e.selected; }));
    });
  }

  function updateFace(face, value) {
    face.selected = value;
    face.obj.material.color.set((face.selected) ? Colors.FACE_SELECT : Colors.FACE);
    if (mode !== "FACE") return;
    face.vertices().forEach(function (v) {
      updateVertex(v, v.faces.some(function (f) { return f.selected; }));
    });
    face.edges().forEach(function (e) {
      updateEdge(e, e.faces().some(function (f) { return f.selected; }));
    });
  }

  function updateTarget(target, value) {
    if (target.type === "VERTEX") updateVertex(target, value);
    if (target.type === "EDGE") updateEdge(target, value);
    if (target.type === "FACE") updateFace(target, value);
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
    if (!Input.action("MULT_SELECT_MOD")) {
      updateAll(false);
    }
    if (targets.length > 0) {
      updateTarget(targets[0], !targets[0].selected);
    }
  }

  Input.register({
    onmousedown: function () {
      if (Input.mode("EDIT") && Input.action("SELECT_GEOM")) {
        if (mode === "VERTEX") performSelection(Geometry.getVertices());
        if (mode === "EDGE") performSelection(Geometry.getEdges());
        if (mode === "FACE") performSelection(Geometry.getFaces());
      }
    },
    onkeydown: function () {
      if(Input.mode("EDIT") || Input.mode("BRUSH_SELECT") || Input.mode("BOX_SELECT")) {
        if(Input.action("SELECT_ALL")) {
          if(Input.action("SELECT_ALL_MOD")){
            if(Input.action("DESELECT_ALL_MOD")){
              updateAll(false);
            } else {
              updateAll(true);
            }
          }
        }
        if (Input.action("SWAP_MODE")) {
          var modes = ["VERTEX", "EDGE", "FACE"];
          mode = modes[(modes.indexOf(mode) + 1) % 3];
        }
      }
    }
  });

  Input.addKeyBinding("LMB", "SELECT_GEOM");
  Input.addKeyBinding("KeyA", "SELECT_ALL");
  Input.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
  Input.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");
  Input.addKeyBinding("ControlLeft", "SELECT_ALL_MOD");
  Input.addKeyBinding("ControlRight", "SELECT_ALL_MOD");
  Input.addKeyBinding("ShiftLeft", "DESELECT_ALL_MOD");
  Input.addKeyBinding("ShiftRight", "DESELECT_ALL_MOD");

  Input.addKeyBinding("KeyN", "SWAP_MODE", "Cycle Select Mode");

  TipsDisplay.registerMode({
    name: "EDIT",
    display: "Edit"
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("SWAP_MODE")} to cycle select mode`;
    }
  })

  EditMenu.registerComponent(function () {
    var selectMenu = document.createElement("div");
    selectMenu.className = "edit-menu-section";

    var title = document.createElement("div");
    title.className = "edit-menu-label";
    title.innerHTML = "Selection";
    selectMenu.appendChild(title);

    var content = document.createElement("div");
    selectMenu.appendChild(content);

    return {
      name: "SelectionMenu",
      element: selectMenu,
      update: function () {
        var verts = Geometry.getSelected().map(function (v) { return v.obj.id; });
        var edges = Geometry.getSelectedEdges().map(function (e) { return e.obj.id; });
        var faces = Geometry.getSelectedFaces().map(function (f) { return f.obj.id; });
        if (verts.length === 0) {
          content.innerHTML = `<div>${mode} mode</div>`;
        } else {
          var center = Geometry.getCenter();
          var position = `(${center.x.toFixed(1)}, ${center.y.toFixed(1)}, ${center.y.toFixed(1)})`;
          content.innerHTML = 
          `<div>${verts.length} vertices (${verts})</div>
          <div>${edges.length} edges (${edges})</div>
          <div>${faces.length} faces (${faces})</div>
          <div>${position}</div>
          <div>${mode} mode</div>`;
        }
      }
    };
  });

  return {
    toggleSelection: updateTarget,
    mode: function (name) {
      if (name === undefined) return mode;
      return name === mode;
    }
  };

});
