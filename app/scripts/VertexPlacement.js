
var VertexPlacement = (function() {
  
  var initialized = false;
  var MAX_VERTS = 10;
  
  function assertInit(val) {
    if(initialized && !val) {
      Debug.log("[VertexPlacement] ERROR: Module already initialized");
      return false;
    } else if(!initialized && val) {
      Debug.log("[VertexPlacement] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  var interface = {
    init: function(vertices, camera, scene, renderer) {
      if(!assertInit(false)) return;
      initialized = true;
      InputHandling.register({
        onmousedown: function(input) {
          if (input.mode === "VERTEX" && input.actions["PLACE_VERTEX"] && vertices.length < MAX_VERTS) {
            var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            var mouse = new THREE.Vector2(
              (input.coords.x2 / renderer.getSize().width) * 2 - 1,
              -(input.coords.y2 / renderer.getSize().height) * 2 + 1
            );
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            var intersection = raycaster.ray.intersectPlane(plane);

            var dotGeometry = new THREE.Geometry();
            var dotMaterial = new THREE.PointsMaterial({
              size: 3, sizeAttenuation: false
            });
            dotGeometry.vertices.push(new THREE.Vector3(
              intersection.x, 0, intersection.z
            ));
            
            var dot = new THREE.Points(dotGeometry, dotMaterial);
            scene.add(dot);
            vertices.push(dot);
          }
        },
        onkeydown: function(input) {
          if(input.actions["TOGGLE_VERTEX_MODE"]) {
            input.mode = (input.mode === "EDIT") ? "VERTEX" : "EDIT";
            InputHandling.mode();
          }
        }
      });
      KeyBindings.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
      KeyBindings.addKeyBinding("LMB", "PLACE_VERTEX");
    }
  };

  return interface;

})();