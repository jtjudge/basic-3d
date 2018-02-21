
var VertexPlacement = (function() {
  
  var initialized = false;
  var MAX_VERTS = 10;
  
  var marker = {
    active: false,
    obj: null
  };

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
          if(input.mode === "VERTEX_XZ" && input.actions["PLACE_VERTEX"]) {
            input.mode = "VERTEX_Y";
          } else if(input.mode === "VERTEX_Y" && input.actions["PLACE_VERTEX"]) {
            vertices.push(marker.obj);
            marker.active = false;
            marker.obj.material.color.setHex(0xffffff);
            input.mode = "EDIT";
          }
        },
        onkeydown: function(input) {
          if(input.actions["TOGGLE_VERTEX_MODE"]) {
            if(input.mode === "VERTEX_XZ" || input.mode === "VERTEX_Y") {
              marker.active = false;
              scene.remove(marker.obj);
              input.mode = "EDIT";
            } else {
              input.mode = "VERTEX_XZ";
            }
            InputHandling.mode();
          }
        },
        onmousemove: function(input) {
          if(vertices.length > MAX_VERTS) return;
          if (input.mode === "VERTEX_XZ") {

            if(!marker.active) {
              marker.active = true;
              var dotGeometry = new THREE.Geometry();
              dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
              var dotMaterial = new THREE.PointsMaterial({
                size: 2, sizeAttenuation: true, color: 0x00ffff
              });
              marker.obj = new THREE.Points(dotGeometry, dotMaterial);
              scene.add(marker.obj);
            }

            var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            var mouse = new THREE.Vector2(
              (input.coords.x2 / renderer.getSize().width) * 2 - 1,
              -(input.coords.y2 / renderer.getSize().height) * 2 + 1
            );
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            var intersection = raycaster.ray.intersectPlane(plane);
            
            if(intersection && intersection.length() < 250) {
              marker.obj.position.copy(intersection);
            }

          } else if(input.mode === "VERTEX_Y") {
            console.log("Y");
          }
        }
      });
      KeyBindings.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
      KeyBindings.addKeyBinding("LMB", "PLACE_VERTEX");
    }
  };

  return interface;

})();