
function initVertexSelection(grid, vertices, camera, scene, renderer, handler) {

  var selected = [];
  var vMode = false;

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
        var intersects = raycaster.intersectObjects(vertices);
        if (intersects.length > 0) {
          var id = intersects[0].object.id;
          if(selected[id] === undefined) selected[id] = false;
          selected[id] = !selected[id];
          var color = (selected[id]) ? 0xffffff : 0xff00ff;
          intersects[0].object.material.color.setHex(color);
        }
      }
    }
  });

}