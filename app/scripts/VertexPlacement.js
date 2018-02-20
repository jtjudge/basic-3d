
function initVertexPlacement(grid, camera, scene, renderer, handler) {

  var MAX_POINTS = 500;
  var geometry = new THREE.BufferGeometry();
  var positions = new Float32Array(MAX_POINTS * 3);
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  var count = {
    c: 0
  };

  var vMode = false;

  handler.register({
    onkeydown: function(input, coords) {
      if(input["KeyV"]) {
        vMode = !vMode;
      }
    },
    onmousedown: function(input, coords) {
      if (input["LMB"] && vMode) {
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
        positions[count.c * 3 + 0] = intersection.x;
        positions[count.c * 3 + 1] = intersection.y;
        positions[count.c * 3 + 2] = intersection.z;
        count.c++;
      }
    }
  });
}