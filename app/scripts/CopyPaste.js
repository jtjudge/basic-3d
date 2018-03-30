
Basic3D.loadModule("CopyPaste", function (Input, Scene, Geometry, Selection, TipsDisplay, History){

  var clipboard = {};
  var empty = true;

  function clear() {
    clipboard = {};
    empty = true;
  }

  function clone(obj) {
    var newObj = {};

    newObj.verts = obj.verts.map(function (v) {
      return { newVert: Geometry.Vertex(v.obj.position), oldVert: v };
    });
    newObj.edges = obj.edges.map(function (e) {
      var v1 = newObj.verts.find(function (v) {
        return v.oldVert === e.v1;
      }).newVert;
      var v2 = newObj.verts.find(function (v) {
        return v.oldVert === e.v2;
      }).newVert;
      return Geometry.Edge(v1, v2);
    });
    newObj.faces = obj.faces.map(function (f) {
      var v1 = newObj.verts.find(function (v) {
        return v.oldVert === f.v1;
      }).newVert;
      var v2 = newObj.verts.find(function (v) {
        return v.oldVert === f.v2;
      }).newVert;
      var v3 = newObj.verts.find(function (v) {
        return v.oldVert === f.v3;
      }).newVert;
      return Geometry.Face(v1, v2, v3);
    });
    newObj.verts = newObj.verts.map(function (v) { return v.newVert; });

    return newObj;
  }

  function copy() {
    clipboard = {
      verts: Geometry.getSelected(),
      edges: Geometry.getEdges().filter(function (e) { return e.selected; }),
      faces: Geometry.getSelectedFaces()
    };
    empty = false;
    console.log("Copied " + clipboard.verts.length + " verts");
  }

  function cut() {
    copy();
    clipboard.verts.forEach(Geometry.removeVertex);
    clipboard.edges.forEach(Geometry.removeEdge);
    clipboard.faces.forEach(Geometry.removeFace);
  }

  function paste() {
    if (empty) return;
    var board = clone(clipboard);
    var move = {
      undo: function () {
        board.verts.forEach(Geometry.removeVertex);
        board.edges.forEach(Geometry.removeEdge);
        board.faces.forEach(Geometry.removeFace);
      },
      redo: function () {
        Selection.toggleAll(false);
        board.verts.forEach(function (v) {
          Geometry.addVertex(v);
          Selection.toggleSelection(v, true);
        });
        board.edges.forEach(function (e) {
          Geometry.addEdge(e);
          Selection.toggleSelection(e, true);
        });
        board.faces.forEach(function (f) {
          Geometry.addFace(f);
          Selection.toggleSelection(f, true);
        });
      }
    };
    move.redo();
    History.addMove(move);
  }

  Input.register({
    onkeydown: function (){
      if(Input.action("READY_MOD") && Input.mode("EDIT")){
        if (Input.action("COPY")) copy();
        if (Input.action("PASTE")) paste();
        if (Input.action("CUT")) cut();
      }
    }
  });

  Basic3D.loadScript("Copy", function () {
    return copy;
  });

  Basic3D.loadScript("Cut", function () {
    return cut;
  });

  Basic3D.loadScript("Paste", function () {
    return paste;
  });

  Input.addKeyBinding("KeyC", "COPY");
  Input.addKeyBinding("KeyX", "CUT");
  Input.addKeyBinding("KeyV", "PASTE");
  Input.addKeyBinding("ControlLeft", "READY_MOD");
  Input.addKeyBinding("ControlRight", "READY_MOD");
  
  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("READY_MOD")} + ${get("COPY")} to copy`;
    },
    condition: function () {
      return Geometry.getSelected().length > 0;
    }
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("READY_MOD")} + ${get("CUT")} to cut`;
    },
    condition: function () {
      return Geometry.getSelected().length > 0;
    }
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("READY_MOD")} + ${get("PASTE")} to paste`;
    },
    condition: function () {
      return !empty;
    }
  });

  return {};
});
