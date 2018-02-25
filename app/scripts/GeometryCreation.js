
Basic3D.loadModule("GeometryCreation", function (Debug, Geometry, InputHandling, AxisHelper) {

  var initialized = false;

  var MAX_VERTS = 100;
  var MAX_DIST = 120;
  var MAX_HEIGHT = 60;

  var marker;

  function assertInit(val) {
    if (initialized && !val) {
      Debug.log("[GeometryCreation] ERROR: Module already initialized");
      return false;
    } else if (!initialized && val) {
      Debug.log("[GeometryCreation] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  function showMarker(scene) {
    if (!marker) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      var material = new THREE.PointsMaterial({
        size: 2, sizeAttenuation: true,
        color: Geometry.getColors().VERTEX_MARKER
      });
      marker = new THREE.Points(geometry, material);
    }
    scene.add(marker);
  }

  function hideMarker(scene) {
    scene.remove(marker);
  }

  function moveMarker(input, renderer, camera) {
    var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    var mouse = new THREE.Vector2(
      (input.coords.x2 / renderer.getSize().width) * 2 - 1,
      -(input.coords.y2 / renderer.getSize().height) * 2 + 1
    );
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersection = raycaster.ray.intersectPlane(plane);
    if (intersection) {
      marker.position.copy(intersection);
      marker.position.clampLength(0, MAX_DIST);
    }
  }

  var interface = {
    init: function (camera, scene, renderer) {
      if (!assertInit(false)) return;
      initialized = true;
      InputHandling.register({
        onmousedown: function (input) {
          if (input.mode === "VERTEX_XZ" && input.actions["PLACE_VERTEX"]) {
            InputHandling.mode("VERTEX_Y");
          } else if (input.mode === "VERTEX_Y" && input.actions["PLACE_VERTEX"]) {
            Geometry.addVertex(marker.position);
            InputHandling.mode("EDIT");
          }
        },
        onkeydown: function (input) {
          if (input.actions["TOGGLE_VERTEX_MODE"]) {
            if (input.mode === "VERTEX_XZ" || input.mode === "VERTEX_Y") {
              InputHandling.mode("EDIT");
            } else if (Geometry.getVertices().length < MAX_VERTS) {
              InputHandling.mode("VERTEX_XZ");
            }
          } else if (input.mode === "EDIT" && input.actions["PLACE_EDGE"]) {
            var selected = Geometry.getSelected();
            if (selected.length === 2) {
              var v1 = selected[0];
              var v2 = selected[1];
              Geometry.addEdge(v1, v2);
            }
          } else if (input.mode === "EDIT" && input.actions["PLACE_FACE"]) {
            var selected = Geometry.getSelected();
            if (selected.length === 3) {
              var v1 = selected[0];
              var v2 = selected[1];
              var v3 = selected[2];
              Geometry.addFace(v1, v2, v3);
              Geometry.addEdge(v1, v2);
              Geometry.addEdge(v2, v3);
              Geometry.addEdge(v1, v3);
            }
          }
        },
        onmousemove: function (input) {
          if (input.mode === "VERTEX_XZ") {
            moveMarker(input, renderer, camera);
          } else if (input.mode === "VERTEX_Y") {
            marker.position.y += -0.15 * (input.coords.y2 - input.coords.y1);
            if (marker.position.y > MAX_HEIGHT) marker.position.y = MAX_HEIGHT;
            if (marker.position.y < -MAX_HEIGHT) marker.position.y = -MAX_HEIGHT;
          }
        },
        onmode: function (input) {
          if (input.mode === "EDIT") {
            hideMarker(scene);
          }
          if (input.mode === "VERTEX_XZ") {
            showMarker(scene);
            moveMarker(input, renderer, camera);
          }
          if (input.mode === "VERTEX_Y") {
            AxisHelper.setY(marker.position);
          }
        }
      });
      InputHandling.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
      InputHandling.addKeyBinding("LMB", "PLACE_VERTEX");
      InputHandling.addKeyBinding("KeyE", "PLACE_EDGE");
      InputHandling.addKeyBinding("KeyF", "PLACE_FACE");
    }
  };

  return interface;

});