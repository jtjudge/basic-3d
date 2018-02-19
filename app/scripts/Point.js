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
    vector.set((event.clientX / window.innerWidth + 32) * 2 - 1, -(event.clientY / window.innerHeight + 32) * 2 + 1, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z + 32;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(pos.x, 0 , pos.y));
    console.log(dotGeometry);
    if(dotGeometry.vertices.length > 1){
      var line = new THREE.Line(dotGeometry, new Three.LineBasicMaterial({}));
      scene.add(line);
    }
    var dotMaterial = new THREE.PointsMaterial({size: 1, sizeAttenuation: false});
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dot);
  }
