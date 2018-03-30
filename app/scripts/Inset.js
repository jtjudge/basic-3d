
Basic3D.loadModule("Inset", function (Input, Geometry, Scene, History, TipsDisplay) {

  var move;

  function getCenter(face) {
    var center = new THREE.Vector3();
    [ face.v1, face.v2, face.v3 ].forEach(function (v) {
      center.add(v.obj.position);
    });
    center.multiplyScalar(1 / 3);
    return center;
  }

  function getAxes(face) {
    var center = getCenter(face);
    var axes = [];
    [ face.v1, face.v2, face.v3 ].forEach(function (v) {
      var axis = new THREE.Vector3().copy(center);
      axis.sub(v.obj.position);
      axes.push(axis);
    });
    return axes;
  }

  function startMove(face) {

    var verts, edges, faces, oldv, center, axes, i;

    oldv = [ face.v1, face.v2, face.v3 ];

    center = getCenter(face);
    axes = getAxes(face);

    verts = [];
    for (i = 0; i < 3; i++) {
      verts.push(Geometry.Vertex(center));
    }

    edges = [];
    faces = [ Geometry.Face(verts[0], verts[1], verts[2])];
    for (i = 0; i < 3; i++) {
      edges.push(Geometry.Edge(verts[i], verts[(i + 1) % 3]));
      edges.push(Geometry.Edge(verts[i], oldv[(i + 1) % 3]));
      edges.push(Geometry.Edge(verts[i], oldv[i]));
      faces.push(Geometry.Face(verts[i], verts[(i + 1) % 3], oldv[(i + 1) % 3]));
      faces.push(Geometry.Face(verts[i], oldv[i], oldv[(i + 1) % 3]));
    }

    verts.forEach(function (v) {
      Scene.add(v.obj);
    });
    edges.forEach(function (e) {
      Scene.add(e.obj);
    });
    faces.forEach(function (f) {
      Scene.add(f.obj);
    });

    Scene.remove(face.obj);

    function cancel() {
      verts.forEach(function (v) {
        Scene.remove(v.obj);
      });
      edges.forEach(function (e) {
        Scene.remove(e.obj);
      });
      faces.forEach(function (f) {
        Scene.remove(f.obj);
      });
      Scene.add(face.obj);
    }

    function confirm() {
      var hist = {
        redo: function () {
          cancel();
          verts.forEach(Geometry.addVertex);
          edges.forEach(Geometry.addEdge);
          faces.forEach(Geometry.addFace);
          Geometry.removeFace(face);
        },
        undo: function () {
          verts.forEach(Geometry.removeVertex);
          edges.forEach(Geometry.removeEdge);
          faces.forEach(Geometry.removeFace);
          Geometry.addFace(face);
        }
      };
      hist.redo();
      History.addMove(hist);
    }

    function translate(diff) {
      for (i = 0; i < 3; i++) {
        verts[i].obj.translateOnAxis(axes[i], diff);
        var slide = new THREE.Vector3().copy(center);
        slide.sub(verts[i].obj.position);
        
        if (slide.dot(axes[i]) < 0) {
          verts[i].obj.position.copy(center);
        }

        if (slide.length() > axes[i].length()) {
          verts[i].obj.position.copy(oldv[i].obj.position);
        }

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
    }

    move = {
      confirm: confirm,
      cancel: cancel,
      translate: translate
    };

  }

  Input.register({
    onmousedown: function () {
      if (Input.mode("INSET")) {
        if (Input.action("CONFIRM_INSET")) {
          move.confirm();
          Input.setMode("EDIT");
        }
      }
    },
    onmousemove: function () {
      if (Input.mode("INSET")) {
        var dy = Scene.getMovementOnY();
        // To do: get movement on axis
        move.translate(dy * -0.01);
      }
    },
    onkeydown: function () {
      if (Input.action("TOGGLE_INSET_MODE")) {
        if (Input.mode("INSET")) {
          move.cancel();
          Input.setMode("EDIT");
        } else if (Input.mode("EDIT")) {
          var faces = Geometry.getSelectedFaces();
          if (faces.length === 1) {
            startMove(faces[0]);
            Input.setMode("INSET");
          }
        }
      }
    }
  });

  Input.addKeyBinding("KeyI", "TOGGLE_INSET_MODE", "Toggle Inset Mode");
  Input.addKeyBinding("LMB", "CONFIRM_INSET");

  TipsDisplay.registerMode({
    name: "INSET",
    display: "Inset"
  });

  TipsDisplay.registerTip({
    mode: "INSET",
    builder: function (get) {
      return `${get("TOGGLE_INSET_MODE")} to cancel`;
    }
  });

  TipsDisplay.registerTip({
    mode: "INSET",
    builder: function (get) {
      return `${get("CONFIRM_INSET")} to confirm`;
    }
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("TOGGLE_INSET_MODE")} to inset`;
    },
    condition: function () {
      return Geometry.getSelectedFaces().length === 1;
    }
  });


  return {};

});