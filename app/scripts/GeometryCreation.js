
var GeometryCreation = (function() {
  
  var initialized = false;
  
  var MAX_VERTS = 10;
  var MAX_DIST = 120;
  var MAX_HEIGHT = 60;
  
  var marker;

  function assertInit(val) {
    if(initialized && !val) {
      Debug.log("[GeometryCreation] ERROR: Module already initialized");
      return false;
    } else if(!initialized && val) {
      Debug.log("[GeometryCreation] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  function showMarker(scene) {
    if(!marker) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      var material = new THREE.PointsMaterial({
        size: 2, sizeAttenuation: true, color: 0x00ff00
      });
      marker = new THREE.Points(geometry, material);
    }
    scene.add(marker);
  }

  function moveMarker(input, renderer, camera){
    var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    var mouse = new THREE.Vector2(
      (input.coords.x2 / renderer.getSize().width) * 2 - 1,
      -(input.coords.y2 / renderer.getSize().height) * 2 + 1
    );
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersection = raycaster.ray.intersectPlane(plane);
    if(intersection) {
      marker.position.copy(intersection);
      marker.position.clampLength(0, MAX_DIST);
    }
  }

  function hideMarker(scene) {
    scene.remove(marker);
  }

  var interface = {
    init: function(camera, scene, renderer) {
      if(!assertInit(false)) return;
      initialized = true;
      InputHandling.register({
        onmousedown: function(input) {
          if(input.mode === "VERTEX_XZ" && input.actions["PLACE_VERTEX"]) {
            input.mode = "VERTEX_Y";
          } else if(input.mode === "VERTEX_Y" && input.actions["PLACE_VERTEX"]) {
            Geometry.addVertex(marker.position);
            hideMarker(scene);
            input.mode = "EDIT";
          }
        },
        onkeydown: function(input) {
          if(input.actions["TOGGLE_VERTEX_MODE"]) {
            if(input.mode === "VERTEX_XZ" || input.mode === "VERTEX_Y") {
              hideMarker(scene);
              input.mode = "EDIT";
            } else {
              input.mode = "VERTEX_XZ";
              showMarker(scene);
              moveMarker(input, renderer, camera);
            }
            InputHandling.mode();
          } else if(input.mode === "EDIT" && input.actions["PLACE_EDGE"]) {
            var selected = Geometry.getSelected();
            if(selected.length === 2) {
              var v1 = selected[0];
              var v2 = selected[1];
              Geometry.addEdge(v1, v2);
            }
          } else if(input.mode === "EDIT" && input.actions["PLACE_FACE"]) {
            var selected = Geometry.getSelected();
            if(selected.length === 3) {
              var v1 = selected[0];
              var v2 = selected[1];
              var v3 = selected[2];
              Geometry.addFace(v1, v2, v3);
            }
          }
        },
        onmousemove: function(input) {
          if (input.mode === "VERTEX_XZ") {
            moveMarker(input, renderer, camera);
          } else if(input.mode === "VERTEX_Y") {
            marker.position.y += -0.15 * (input.coords.y2 - input.coords.y1);
            if(marker.position.y > MAX_HEIGHT) marker.position.y = MAX_HEIGHT;
            if(marker.position.y < -MAX_HEIGHT) marker.position.y = -MAX_HEIGHT;
          }
        }
      });
      KeyBindings.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
      KeyBindings.addKeyBinding("LMB", "PLACE_VERTEX");
      KeyBindings.addKeyBinding("KeyE", "PLACE_EDGE");
      KeyBindings.addKeyBinding("KeyF", "PLACE_FACE");
    }
  };

  return interface;

})();