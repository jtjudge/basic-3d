function cameraControl(c, ch)
{
  var distance = c.position.length();
  var q, q2;
  var speed = 10;
  switch (ch)
  {
  // camera controls
  case 'w':
    c.translateZ(-0.1 * speed);
    return true;
  case 'a':
    c.translateX(-0.1 * speed);
    return true;
  case 's':
    c.translateZ(0.1 * speed);
    return true;
  case 'd':
    c.translateX(0.1 * speed);
    return true;
  case 'r':
    c.translateY(0.1 * speed);
    return true;
  case 'f':
    c.translateY(-0.1 * speed);
    return true;
  case 'j':
    // need to do extrinsic rotation about world y axis, so multiply camera's quaternion
    // on left
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    c.setRotationFromQuaternion(q.multiply(c.quaternion))
//    q2 = new THREE.Quaternion().copy(c.quaternion);
//    c.quaternion.copy(q).multiply(q2);
    return true;
  case 'l':
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    c.setRotationFromQuaternion(q.multiply(c.quaternion))
//    q2 = new THREE.Quaternion().copy(c.quaternion);
//    c.quaternion.copy(q).multiply(q2);
    return true;
  case 'i':
    // intrinsic rotation about camera's x-axis
    c.rotateX(5 * Math.PI / 180);
    return true;
  case 'k':
    c.rotateX(-5 * Math.PI / 180);
    return true;
  case 'O':
    c.lookAt(new THREE.Vector3(0, 0, 0));
    return true;
  case 'S':
    c.fov = Math.min(80, c.fov + 5);
    c.updateProjectionMatrix();
    return true;
  case 'W':
    c.fov = Math.max(5, c.fov  - 5);
    c.updateProjectionMatrix();
    return true;

    // orbits - alternates for arrow keys
  case 'J':
    //this.orbitLeft(5, distance)
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    c.setRotationFromQuaternion(q.multiply(c.quaternion))
    //q2 = new THREE.Quaternion().copy(c.quaternion);
    //c.quaternion.copy(q).multiply(q2);
    c.translateZ(distance)
    return true;
  case 'L':
    //this.orbitRight(5, distance)  
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    c.setRotationFromQuaternion(q.multiply(c.quaternion))
    //q2 = new THREE.Quaternion().copy(c.quaternion);
    //c.quaternion.copy(q).multiply(q2);
    c.translateZ(distance)
    return true;
  case 'I':
    //this.orbitUp(5, distance)      
    c.translateZ(-distance);
    c.rotateX(-5 * Math.PI / 180);
    c.translateZ(distance)
    return true;
  case 'K':
    //this.orbitDown(5, distance)  
    c.translateZ(-distance);
    c.rotateX(5 * Math.PI / 180);
    c.translateZ(distance)
    return true;
  }
  return false;
}
