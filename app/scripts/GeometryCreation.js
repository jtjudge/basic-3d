
Basic3D.loadModule("GeometryCreation", function (InputHandling, Scene, Colors, Geometry, History) {

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

  function moveMarker(input) {
    var intersection = Scene.getMovementOnXZ(input).current;
    if (intersection) {
      marker.position.copy(intersection);
      marker.position.clampLength(0, MAX_DIST);
    }
  }

  InputHandling.register({
    onmousedown: function (input) {
      if (input.mode === "VERTEX_XZ" && input.actions["PLACE_VERTEX"]) {
        InputHandling.mode("VERTEX_Y");
      } else if (input.mode === "VERTEX_Y" && input.actions["PLACE_VERTEX"]) {
        var pos = new THREE.Vector3().copy(marker.position);
        var vert = new Geometry.Vertex(pos);
        var move = {
          undo: function () { Geometry.removeVertex(vert); },
          redo: function () { Geometry.addVertex(vert); }
        };
        move.redo();
        History.addMove(move);
        InputHandling.mode("EDIT");
      }
    },
    onkeydown: function (input) {
      if (input.mode === "EDIT") {
        if (input.actions["DELETE_VERTEX"]) {
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
        } else if (input.actions["PLACE_EDGE"]) {
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
        } else if (input.actions["PLACE_FACE"]) {
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
              redo: function() {
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
      }
      if (input.actions["TOGGLE_VERTEX_MODE"]) {
        if (input.mode === "VERTEX_XZ" || input.mode === "VERTEX_Y") {
          InputHandling.mode("EDIT");
        } else if (Geometry.getVertices().length < MAX_VERTS) {
          InputHandling.mode("VERTEX_XZ");
        }
      }
    },
    onmousemove: function (input) {
      if (input.mode === "VERTEX_XZ") {
        moveMarker(input);
      } else if (input.mode === "VERTEX_Y") {
        marker.position.y -= 0.15 * (input.coords.y2 - input.coords.y1);
        if (marker.position.y > MAX_HEIGHT) marker.position.y = MAX_HEIGHT;
        if (marker.position.y < -MAX_HEIGHT) marker.position.y = -MAX_HEIGHT;
      }
    },
    onmode: function (input) {
      if (input.mode === "EDIT") {
        Scene.remove(marker);
      }
      if (input.mode === "VERTEX_XZ") {
        showMarker();
        moveMarker(input);
      }
      if (input.mode === "VERTEX_Y") {
        Scene.showY(marker.position);
      }
    }
  });

  InputHandling.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
  InputHandling.addKeyBinding("LMB", "PLACE_VERTEX");
  InputHandling.addKeyBinding("KeyE", "PLACE_EDGE");
  InputHandling.addKeyBinding("KeyF", "PLACE_FACE");
  InputHandling.addKeyBinding("KeyX", "DELETE_VERTEX");

  return {};

});
