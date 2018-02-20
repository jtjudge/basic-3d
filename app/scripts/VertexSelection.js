
function initVertexSelection(grid, vertices, camera, scene, renderer, handler) {

  var selected = [];
  var vMode = false;

  var SELECT_COLOR = 0xff0000;
  var DESELECT_COLOR = 0xffffff;

  handler.register({
    onkeydown: function(input, coords) {
      if(input["KeyV"]) {
        vMode = !vMode;
      }
    },
    onmousedown: function(input, coords) {
      if (input["LMB"] && !vMode) {
        var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        var mouse = new THREE.Vector3(
          (coords.x2 / renderer.getSize().width) * 2 - 1,
          -(coords.y2 / renderer.getSize().height) * 2 + 1,
          0.5
        );
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        var verts = raycaster.intersectObjects(vertices);
        if (verts.length > 0) {
          if(selected.length > 0) {
            if(input["ShiftLeft"] || input["ShiftRight"]) {
              var index = selected.findIndex(function(v) {
                return v.id === verts[0].object.id;
              });
              if(index !== -1) {
                var vert = selected.splice(index, 1)[0];
                vert.material.color.setHex(DESELECT_COLOR);
              } else {
                selected.push(verts[0].object);
                verts[0].object.material.color.setHex(SELECT_COLOR);
              }
            } else {
              selected.forEach(function(obj) {
                obj.material.color.setHex(DESELECT_COLOR);
              });
              selected = [];
              selected.push(verts[0].object);
              verts[0].object.material.color.setHex(SELECT_COLOR);
            }
          } else {
            selected.push(verts[0].object);
            verts[0].object.material.color.setHex(SELECT_COLOR);
          }
        } else {
          if(!input["ShiftLeft"] && !input["ShiftRight"]) {
            selected.forEach(function(obj) {
              obj.material.color.setHex(DESELECT_COLOR);
            });
            selected = [];
          }
        }
      }
    }
  });

  var interface = {
    getSelected: function() {
      return selected;
    }
  };

  return interface;

}