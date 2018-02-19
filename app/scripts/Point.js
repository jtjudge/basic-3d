function addPoint(c) {
  var camera = c;
  var input = [];
  var mouseCoords = {
    x: 0,
    y: 0
  };
  return {

  }
  if (input["KeyV"]) {
    var vector = new THREE.Vector3();
    vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(pos.x, 0 , pos.y));
    var dotMaterial = new THREE.PointsMaterial({size: 1, sizeAttenuation: false});
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dot);
  }
