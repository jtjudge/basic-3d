
Basic3D.loadModule("Extrusion", function (Input, Scene, Controls, Geometry, Selection, History, TipsDisplay) {

  var moveStarted = false;
  var move, newGeo;

  function extrudeFace(face) {
    var v = [];
    var e = [];
    var f = [];
    var v1 = Geometry.Vertex(face.v1.obj.position);
    var v2 = Geometry.Vertex(face.v2.obj.position);
    var v3 = Geometry.Vertex(face.v3.obj.position);
    v.push(v1);
    v.push(v2);
    v.push(v3);
    e.push(Geometry.Edge(v1, v2));
    e.push(Geometry.Edge(v2, v3));
    e.push(Geometry.Edge(v3, v1));
    e.push(Geometry.Edge(v1, face.v2));
    e.push(Geometry.Edge(v3, face.v1));
    e.push(Geometry.Edge(v2, face.v3));
    e.push(Geometry.Edge(v1, face.v1));
    e.push(Geometry.Edge(v2, face.v2));
    e.push(Geometry.Edge(v3, face.v3));
    f.push(Geometry.Face(v1, v2, v3));
    f.push(Geometry.Face(v2, v1, face.v2));
    f.push(Geometry.Face(v1, face.v2, face.v1));
    f.push(Geometry.Face(v3, v2, face.v3));
    f.push(Geometry.Face(v2, face.v3, face.v2));
    f.push(Geometry.Face(v1, v3, face.v1));
    f.push(Geometry.Face(v3, face.v1, face.v3));
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
