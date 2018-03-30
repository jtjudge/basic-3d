
Basic3D.loadModule("Creation", function (Input, Scene, Colors, Geometry, Selection, History, TipsDisplay) {

  var MAX_VERTS = 100;
  var MAX_DIST = 120;
  var MAX_HEIGHT = 60;

  var marker, locked = false;

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
          undo: function () {
            Geometry.removeVertex(vert);
            Selection.toggleSelection(vert, false);
          },
          redo: function () {
            Geometry.addVertex(vert);
            Selection.toggleSelection(vert, true);
          }
        };
        move.redo();
        History.addMove(move);
        Input.setMode("EDIT");
      }
    },
    onkeydown: function () {

      if (Input.action("TOGGLE_VERTEX_MODE") && !Input.action("READY_MOD")) {
        
        if (Input.mode("VERTEX_XZ") || Input.mode("VERTEX_Y")) {
          Input.setMode("EDIT");
        } else if (Input.mode("EDIT") && Geometry.getVertices().length < MAX_VERTS) {
          Input.setMode("VERTEX_XZ");
        }

      }

      if (!(Input.mode("EDIT") || Input.mode("BRUSH_SELECT") || Input.mode("BOX_SELECT"))) return;

      if (Input.action("DELETE_GEOM") && !Input.action("READY_MOD")) {

        if (Selection.mode("VERTEX")) {
          var selected = Geometry.getSelected();
          var move = {
            undo: function () {
              selected.forEach(function (v) {
                Geometry.addVertex(v);
                v.edges.forEach(function(e) {
                  Geometry.addEdge(e);
                  Selection.toggleSelection(e, true);
                });
                v.faces.forEach(function(f) {
                  Geometry.addFace(f);
                  Selection.toggleSelection(f, true);
                });
              });
            },
            redo: function () {
              selected.forEach(function (v) {
                Geometry.removeVertex(v);
                v.edges.forEach(function(e) {
                  Geometry.removeEdge(e);
                  Selection.toggleSelection(e, false);
                });
                v.faces.forEach(function(f) {
                  Geometry.removeFace(f);
                  Selection.toggleSelection(f, false);
                });
              });
            }
          };
          move.redo();
          History.addMove(move);
        }
        
        if (Selection.mode("EDGE")) {
          var selected = Geometry.getSelectedEdges();
          var move = {
            undo: function () {
              selected.forEach(function (e) {
                Geometry.addEdge(e);
                e.faces().forEach(function (f) {
                  Geometry.addFace(f);
                });
              });
            },
            redo: function () {
              selected.forEach(function (e) {
                Geometry.removeEdge(e);
                e.faces().forEach(function (f) {
                  Geometry.removeFace(f);
                });
              });
            }
          };
          move.redo();
          History.addMove(move);
        }
        
        if (Selection.mode("FACE")) {
          var selected = Geometry.getSelectedFaces();
          var move = {
            undo: function () {
              selected.forEach(Geometry.addFace);
            },
            redo: function () {
              selected.forEach(Geometry.removeFace);
            }
          };
          move.redo();
          History.addMove(move);
        }

      } else if (Input.action("PLACE_EDGE")) {

        var selected = Geometry.getSelected();
        if(selected.length > 1) {
          var edges = [];
          for (var i = 0; i < selected.length - 1; i++) {
            var v1 = selected[i];
            var v2 = selected[i+1];
            var edge1 = Geometry.Edge(v1, v2);
            edges.push(edge1);
          }
          var move = {
            undo: function () {
              edges.forEach(function(e) {
                Geometry.removeEdge(e);
                Selection.toggleSelection(e, false);
              });
            },
            redo: function () {
              edges.forEach(function(e) {
                Geometry.addEdge(e);
                Selection.toggleSelection(e, true);
              });
            }
          };
          move.redo();
          History.addMove(move);
        }

      } else if (Input.action("PLACE_FACE")) {

        var selected = Geometry.getSelected();
        if (selected.length > 2) {
          var edges = [], faces = [];
          for (var i = 0; i < selected.length - 2; i++) {
            var v1 = selected[i];
            var v2 = selected[i+1];
            var v3 = selected[i+2];
            var edge1 = Geometry.Edge(v1, v2);
            var edge2 = Geometry.Edge(v2, v3);
            var edge3 = Geometry.Edge(v1, v3);
            var face = Geometry.Face(v1, v2, v3);
            edges.push(edge1, edge2, edge3);
            faces.push(face);
          }
          var move = {
            undo: function () {
              edges.forEach(function(e) {
                Geometry.removeEdge(e);
                Selection.toggleSelection(e, false);
              });
              faces.forEach(function(f) {
                Geometry.removeFace(f);
                Selection.toggleSelection(f, false);
              });
            },
            redo: function () {
              edges.forEach(function(e) {
                Geometry.addEdge(e);
                Selection.toggleSelection(e, true);
              });
              faces.forEach(function(f) {
                Geometry.addFace(f);
                Selection.toggleSelection(f, true);
              });
            }
          };
          move.redo();
          History.addMove(move);
        }

      }

    },
    onmousemove: function () {
      if (Input.mode("VERTEX_XZ") && !locked) {
        moveMarker();
      } else if (Input.mode("VERTEX_Y") && !locked) {
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
  Input.addKeyBinding("KeyX", "DELETE_GEOM");

  TipsDisplay.registerMode({
    name: "VERTEX",
    mapped: ["VERTEX_XZ", "VERTEX_Y"],
    display: "Vertex"
  });

  TipsDisplay.registerTip({
    mode: "VERTEX",
    builder: function (get) {
      return `Drag to move on XZ-plane`;
    },
    condition: function () {
      return Input.mode("VERTEX_XZ");
    }
  });
  TipsDisplay.registerTip({
    mode: "VERTEX",
    builder: function (get) {
      return `Drag to move along Y-axis`;
    },
    condition: function () {
      return Input.mode("VERTEX_Y");
    }
  });
  TipsDisplay.registerTip({
    mode: "VERTEX",
    builder: function (get) {
      return `${get("PLACE_VERTEX")} to confirm`;
    }
  });
  TipsDisplay.registerTip({
    mode: "VERTEX",
    builder: function (get) {
      return `${get("TOGGLE_VERTEX_MODE")} to cancel`;
    }
  });
  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("DELETE_GEOM")} to delete`;
    },
    condition: function () {
      return Geometry.getSelected().length > 0;
    }
  });
  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("TOGGLE_VERTEX_MODE")} to create vertex`;
    }
  });
  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("PLACE_EDGE")} to create edge`;
    },
    condition: function () {
      return Geometry.getSelected().length === 2;
    }
  });
  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("PLACE_FACE")} to create face`;
    },
    condition: function () {
      return Geometry.getSelected().length === 3;
    }
  });

  return {
    active: function () {
      return Input.mode("VERTEX_XZ") || Input.mode("VERTEX_Y");
    },
    marker: function () {
      return (marker === undefined) ? new THREE.Vector3() : marker.position;
    },
    markerObj: function () {
      return { obj: marker, edges: [], faces: [] };
    },
    snapped: function () {
      return locked;
    },
    snap: function () {
      locked = true;
    },
    unsnap: function () {
      locked = false;
    }
  };

});
