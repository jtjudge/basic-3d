
Basic3D.loadModule("Creation", function (Input, Scene, Colors, Geometry, History) {

  var MAX_VERTS = 100;
  var MAX_DIST = 120;
  var MAX_HEIGHT = 60;

  var marker;

  function showMarker() {
    if (!marker) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      var material = new THREE.PointsMaterial({
        size: 2, sizeAttenuation: true,
        color: Colors.VERTEX_MARKER
      });
      marker = new THREE.Points(geometry, material);
    }
    Scene.add(marker);
  }

  function moveMarker() {
    var intersection = Scene.getMovementOnXZ().current;
    if (intersection) {
      marker.position.copy(intersection);
      marker.position.clampLength(0, MAX_DIST);
    }
  }

  Input.register({
    onmousedown: function () {
      if (Input.mode("VERTEX_XZ") && Input.action("PLACE_VERTEX")) {
        Input.setMode("VERTEX_Y");
      } else if (Input.mode("VERTEX_Y") && Input.action("PLACE_VERTEX")) {
        var pos = new THREE.Vector3().copy(marker.position);
        var vert = new Geometry.Vertex(pos);
        var move = {
          undo: function () { Geometry.removeVertex(vert); },
          redo: function () { Geometry.addVertex(vert); }
        };
        move.redo();
        History.addMove(move);
        Input.setMode("EDIT");
      }
    },
    onkeydown: function () {
      if (Input.action("TOGGLE_VERTEX_MODE")) {
        if (Input.mode("VERTEX_XZ") || Input.mode("VERTEX_Y")) {
          Input.setMode("EDIT");
        } else if (Input.mode("EDIT") && Geometry.getVertices().length < MAX_VERTS) {
          Input.setMode("VERTEX_XZ");
        }
      }
      if (!Input.mode("EDIT")) return;
      if (Input.action("DELETE_VERTEX")) {
        var selected = Geometry.getSelected();
        var move = {
          undo: function () {
            selected.forEach(function (v) {
              Geometry.addVertex(v);
              v.edges.forEach(Geometry.addEdge);
              v.faces.forEach(Geometry.addFace);
            });
          },
          redo: function () {
            selected.forEach(function (v) {
              Geometry.removeVertex(v);
              v.edges.forEach(Geometry.removeEdge);
              v.faces.forEach(Geometry.removeFace);
            });
          }
        };
        move.redo();
        History.addMove(move);
      } else if (Input.action("PLACE_EDGE")) {
        var selected = Geometry.getSelected();
        if (selected.length === 2) {
          var v1 = selected[0];
          var v2 = selected[1];
          var edge = Geometry.Edge(v1, v2);
          var move = {
            undo: function () { Geometry.removeEdge(edge); },
            redo: function () { Geometry.addEdge(edge); }
          };
          move.redo();
          History.addMove(move);
        }
      } else if (Input.action("PLACE_FACE")) {
        var selected = Geometry.getSelected();
        if (selected.length === 3) {
          var v1 = selected[0];
          var v2 = selected[1];
          var v3 = selected[2];
          var edge1 = Geometry.Edge(v1, v2);
          var edge2 = Geometry.Edge(v2, v3);
          var edge3 = Geometry.Edge(v1, v3);
          var face = Geometry.Face(v1, v2, v3, edge1, edge2, edge3);
          var move = {
            undo: function () {
              Geometry.removeFace(face);
              Geometry.removeEdge(edge1);
              Geometry.removeEdge(edge2);
              Geometry.removeEdge(edge3);
            },
            redo: function () {
              Geometry.addFace(face);
              Geometry.addEdge(edge1);
              Geometry.addEdge(edge2);
              Geometry.addEdge(edge3);
            }
          };
          move.redo();
          History.addMove(move);
        }
      }
    },
    onmousemove: function () {
      if (Input.mode("VERTEX_XZ")) {
        moveMarker();
      } else if (Input.mode("VERTEX_Y")) {
        marker.position.y += Scene.getMovementOnY();
        if (marker.position.y > MAX_HEIGHT) marker.position.y = MAX_HEIGHT;
        if (marker.position.y < -MAX_HEIGHT) marker.position.y = -MAX_HEIGHT;
      }
    },
    onmode: function () {
      if (Input.mode("EDIT")) {
        Scene.remove(marker);
      }
      if (Input.mode("VERTEX_XZ")) {
        showMarker();
        moveMarker();
      }
      if (Input.mode("VERTEX_Y")) {
        Scene.showY(marker.position);
      }
    }
  });

  Input.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
  Input.addKeyBinding("LMB", "PLACE_VERTEX");
  Input.addKeyBinding("KeyE", "PLACE_EDGE");
  Input.addKeyBinding("KeyF", "PLACE_FACE");
  Input.addKeyBinding("KeyX", "DELETE_VERTEX");

  return {};

});
