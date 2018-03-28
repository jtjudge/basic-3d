
Basic3D.loadModule("Extrusion", function (Input, Scene, Controls, Geometry, History, TipsDisplay) {

  var move;

  function startMove(face) {

    var verts, edges, faces, oldv, i;

    oldv = [face.v1, face.v2, face.v3];
    verts = oldv.map(function (vtx) {
      return Geometry.Vertex(vtx.obj.position);
    });
    edges = [];
    faces = [Geometry.Face(verts[0], verts[1], verts[2])];

    for (i = 0; i < 3; i++) {
      edges.push(Geometry.Edge(verts[i], verts[(i + 1) % 3]));
      edges.push(Geometry.Edge(verts[i], oldv[(i + 1) % 3]));
      edges.push(Geometry.Edge(verts[i], oldv[i]));
      faces.push(Geometry.Face(verts[i], verts[(i + 1) % 3], oldv[(i + 1) % 3]));
      faces.push(Geometry.Face(verts[i], oldv[i], oldv[(i + 1) % 3]));
    }

    verts.forEach(function (vert) {
      Scene.add(vert.obj);
    });
    edges.forEach(function (edge) {
      Scene.add(edge.obj);
    });
    faces.forEach(function (face) {
      Scene.add(face.obj);
    });

    function cancel() {
      verts.forEach(function (vert) {
        Scene.remove(vert.obj);
      });
      edges.forEach(function (edge) {
        Scene.remove(edge.obj);
      });
      faces.forEach(function (face) {
        Scene.remove(face.obj);
      });
    }

    function confirm() {
      var hist = {
        redo: function () {
          cancel();
          verts.forEach(Geometry.addVertex);
          edges.forEach(Geometry.addEdge);
          faces.forEach(Geometry.addFace);
        },
        undo: function () {
          verts.forEach(Geometry.removeVertex);
          edges.forEach(Geometry.removeEdge);
          faces.forEach(Geometry.removeFace);
        }
      };
      hist.redo();
      History.addMove(hist);
    }

    function translate(diff) {
      var face = faces[0];
      var vect = face.obj.geometry.faces[0].normal;
      face.v1.obj.translateOnAxis(vect, diff);
      face.v2.obj.translateOnAxis(vect, diff);
      face.v3.obj.translateOnAxis(vect, diff);
      edges.forEach(function (e) {
        e.obj.geometry.verticesNeedUpdate = true;
        e.obj.geometry.boundingSphere = null;
        e.obj.geometry.boundingBox = null;
      });
      faces.forEach(function (f) {
        f.obj.geometry.verticesNeedUpdate = true;
        f.obj.geometry.boundingSphere = null;
        f.obj.geometry.boundingBox = null;
      });
    }

    move = {
      confirm: confirm,
      cancel: cancel,
      translate: translate
    };
  
  }

  Input.register({
    onmousedown: function () {
      if (Input.mode("EXTRUDE") && Input.action("CONFIRM_EXTRUDE")) {
        move.confirm();
        Controls.enable(["orbit"]);
        Input.setMode("EDIT");
      }
    },
    onkeydown: function () {
      if (!Input.action("TOGGLE_EXTRUDE_MODE")) return;
      if (Input.mode("EDIT")) {
        if (Geometry.getSelectedFaces().length === 1) {
          startMove(Geometry.getSelectedFaces()[0]);
          Input.setMode("EXTRUDE");
          Controls.disable(["orbit"]);
        }
      } else if (Input.mode("EXTRUDE")) {
        move.cancel();
        Controls.enable(["orbit"]);
        Input.setMode("EDIT");
      }
    },
    onmousemove: function () {
      if (Input.mode("EXTRUDE")) {
        var dy = Scene.getMovementOnY();
        // To do: get movement on axis
        move.translate(dy);
      }
    }
  });

  Input.addKeyBinding("KeyQ", "TOGGLE_EXTRUDE_MODE", "Toggle Extrude");
  Input.addKeyBinding("LMB", "CONFIRM_EXTRUDE");

  TipsDisplay.registerMode({
    name: "EXTRUDE",
    display: "Extrude"
  });

  TipsDisplay.registerTip({
    mode: "EXTRUDE",
    builder: function (get) {
      return `${get("CONFIRM_EXTRUDE")} to confirm`;
    }
  });

  TipsDisplay.registerTip({
    mode: "EXTRUDE",
    builder: function (get) {
      return `${get("TOGGLE_EXTRUDE_MODE")} to cancel`;
    }
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("TOGGLE_EXTRUDE_MODE")} to extrude`;
    },
    condition: function () {
      return Geometry.getSelectedFaces().length === 1;
    }
  });

  return {};

});
