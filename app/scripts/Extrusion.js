
Basic3D.loadModule("Extrusion", function (Input, Scene, Controls, Geometry) {

  var newGeo = null;

  function confirmMove() {
    newGeo.vertices.forEach(Geometry.addVertex);
    newGeo.edges.forEach(Geometry.addEdge);
    newGeo.faces.forEach(Geometry.addFace);
  }

  function startMove(face) {
    var fv = [face.v1, face.v2, face.v3];
    var v = fv.map(function (vtx) {
      return Geometry.Vertex(vtx.obj.position);
    });
    var e = [];
    var f = [Geometry.Face(v[0], v[1], v[2])];
    for (i = 0; i < 3; i++) {
      e.push(Geometry.Edge(v[i], v[(i + 1) % 3]));
      e.push(Geometry.Edge(v[i], fv[(i + 1) % 3]));
      e.push(Geometry.Edge(v[i], fv[i]));
      f.push(Geometry.Face(v[i], v[(i + 1) % 3], fv[(i + 1) % 3]));
      f.push(Geometry.Face(v[i], fv[i], fv[(i + 1) % 3]));
    }
    newGeo = {
      vertices: v,
      edges: e,
      faces: f
    };
    newGeo.vertices.forEach(function (vert) {
      Scene.add(vert.obj);
    });
    newGeo.edges.forEach(function (edge) {
      Scene.add(edge.obj);
    });
    newGeo.faces.forEach(function (face) {
      Scene.add(face.obj);
    });
  }

  function translateFace(face, diff) {
    var vect = face.obj.geometry.faces[0].normal;
    face.v1.obj.translateOnAxis(vect, diff);
    face.v2.obj.translateOnAxis(vect, diff);
    face.v3.obj.translateOnAxis(vect, diff);
    newGeo.edges.forEach(function (e) {
      e.obj.geometry.verticesNeedUpdate = true;
    });
    newGeo.faces.forEach(function (f) {
      f.obj.geometry.verticesNeedUpdate = true;
    });
  }

  Input.register({
    onmousedown: function () {
      if (Input.mode("EXTRUDE") && Input.action("CONFIRM_EXTRUDE")) {
        confirmMove();
        Controls.enable(["orbit"]);
        Input.setMode("EDIT");
      }
    },
    onkeydown: function () {
      if (!Input.action("TOGGLE_EXTRUDE_MODE")) return;
      if (Input.mode("EDIT")) {
        if (Geometry.getSelectedFaces().length === 1) {
          Input.setMode("EXTRUDE");
          Controls.disable(["orbit"]);
          startMove(Geometry.getSelectedFaces()[0]);
        }
      } else if (Input.mode("EXTRUDE")) {
        newGeo = null;
        Controls.enable(["orbit"]);
        Input.setMode("EDIT");
      }
    },
    onmousemove: function () {
      if (Input.mode("EXTRUDE")) {
        var dy = Scene.getMovementOnY();
        // To do: get movement on axis
        translateFace(newGeo.faces[0], dy);
      }
    }
  });

  Input.addKeyBinding("KeyY", "TOGGLE_EXTRUDE_MODE", "Toggle Extrude");
  Input.addKeyBinding("LMB", "CONFIRM_EXTRUDE");

  return {};

});
