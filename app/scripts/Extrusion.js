
Basic3D.loadModule("Extrusion", function (Input, Scene, Controls, Geometry, Selection, History, TipsDisplay) {

  var moveStarted = false;
  var move, newGeo;

  function extrudeFace(face) {
    var fv = [face.v1, face.v2, face.v3];
    var v = fv.map(function(vtx) {
      return Geometry.Vertex(vtx.obj.position);
    });
    var e = [];
    var f = [Geometry.Face(v[0], v[1], v[2])];
    for(i = 0; i < 3; i++) {
      e.push(Geometry.Edge(v[i], v[(i+1) % 3]));
      e.push(Geometry.Edge(v[i], fv[(i+1) % 3]));
      e.push(Geometry.Edge(v[i], fv[i]));
      f.push(Geometry.Face(v[i], v[(i+1) % 3], fv[(i+1) % 3]));
      f.push(Geometry.Face(v[i], fv[i], fv[(i+1) % 3]));
    }
    return {
      v : v,
      e : e,
      f : f
    };
  }

  function addGeometry(geometry) {
    geometry.v.forEach(function (vert) {
      Geometry.addVertex(vert);
    });
    geometry.e.forEach(function (edge) {
      Geometry.addEdge(edge);
    });
    geometry.f.forEach(function (face) {
      Geometry.addFace(face);
    });
  }

  function removeGeometry(geometry) {
    geometry.v.forEach(function (vert) {
      Geometry.removeVertex(vert);
    });
    geometry.e.forEach(function (edge) {
      Geometry.removeEdge(edge);
    });
    geometry.f.forEach(function (face) {
      Geometry.removeFace(face);
    });
  }

  function startMove(face) {
    newGeo = extrudeFace(face[0]);
    addGeometry(newGeo);
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

  Input.register({
    onmousedown: function () {
      if(Input.mode("Extrude") && moveStarted){
        Controls.enable(["orbit"]);
        Input.setMode("EDIT");
        moveStarted = false;
      }
    },
    onkeydown: function() {
      if(Input.action("TOGGLE_EXTRUSION")) {
        if(Input.mode("EDIT") && !moveStarted) {
          if(Geometry.getSelectedFaces().length === 1) {
            Controls.disable(["orbit"]);
            Input.setMode("Extrude");
            moveStarted = true;
            startMove(Geometry.getSelectedFaces());
          }
        } else if(Input.mode("Extrude") && moveStarted) {
          Controls.enable(["orbit"]);
          removeGeometry(newGeo);
          Input.setMode("EDIT");
          moveStarted = false;
        }
      }
    },
    onmousemove: function() {
      if(Input.mode("Extrude")) {
        var dx = Scene.getMovementOnXZ().diff.x;
        var dy = Scene.getMovementOnY();
        var dz = Scene.getMovementOnXZ().diff.z;
        translateVertex(newGeo.v[0], new THREE.Vector3(dx, dy, dz));
        translateVertex(newGeo.v[1], new THREE.Vector3(dx, dy, dz));
        translateVertex(newGeo.v[2], new THREE.Vector3(dx, dy, dz));
      }
    }
  });
  Input.addKeyBinding("KeyY", "TOGGLE_EXTRUSION", "Toggle Extrusion");

  return {};
});
