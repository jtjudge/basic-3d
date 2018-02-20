
function initVertexPlacement(grid, vertices, camera, scene, renderer, handler) {

  var MAX_VERTS = 10;
  var vMode = false;

  handler.register({
    onkeydown: function(input, coords) {
      if(input["KeyV"]) {
        vMode = !vMode;
      }
    },
    onmousedown: function(input, coords) {
      if (input["LMB"] && vMode && vertices.length < MAX_VERTS) {
        var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        mouse.x = (coords.x2 / renderer.getSize().width) * 2 - 1;
        mouse.y = -(coords.y2 / renderer.getSize().height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersection = raycaster.ray.intersectPlane(plane);
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3(intersection.x, 0, intersection.z));
        var dotMaterial = new THREE.PointsMaterial({size: 3, sizeAttenuation: false});
        var dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
        vertices.push(dot);
      }
    }
  });
}