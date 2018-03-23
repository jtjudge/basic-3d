
Basic3D.loadModule("Extrusion", function (Input, Scene, Controls, Geometry, Selection, History, TipsDisplay) {

  var moveStarted = false;
  var move, newGeo;

  function faceFromExistingFace(face) {
    var v1 = Geometry.Vertex(face.v1.obj.position);
    var v2 = Geometry.Vertex(face.v2.obj.position);
    var v3 = Geometry.Vertex(face.v3.obj.position);
    var e1 = Geometry.Edge(v1, v2);
    var e2 = Geometry.Edge(v2, v3);
    var e3 = Geometry.Edge(v1, v3);
    var f = Geometry.Face(v1, v2, v3);
    Scene.add(v1);
    Scene.add(f.obj);
    return {
      v1 : v1,
      v2 : v2,
      v3 : v3,
      e1 : e1,
      e2 : e2,
      e3 : e3,
      f : f
    };
  }

  function startMove(face) {
    newGeo = faceFromExistingFace(face[0]);
    face.selected = false;
    newGeo.selected = true;

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
    onkeydown: function() {
      if(Input.action("TOGGLE_EXTRUSION")) {
        if(Input.mode("EDIT") && !moveStarted) {
          if(Geometry.getSelectedFaces().length = 1) {
            Controls.disable(["orbit"]);
            Input.setMode("Extrude");
            moveStarted = true;
            startMove(Geometry.getSelectedFaces());
          }
        } else if(Input.mode("Extrude") && moveStarted) {
          Controls.enable(["orbit"]);
          Scene.remove(newGeo.f.obj);
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
        Geometry.getSelected().forEach(function (v) {
          translateVertex(v, new THREE.Vector3(dx, dy, dz));
        });
      }
    }
  });
  Input.addKeyBinding("KeyY", "TOGGLE_EXTRUSION", "Toggle Extrusion");

  return {};

});
