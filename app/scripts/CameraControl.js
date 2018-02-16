function addControls(c) {
	var camera = c;
	var input = [];

	function reset() {
		camera.position.x = 150;
		camera.position.y = 100;
		camera.position.z = 150;
		camera.lookAt(new THREE.Vector3(0, 0, 0));
	}
	
	reset();
	
	return {
		keyDown: function(event) {
			input[event.code] = true;
		},
		keyUp: function(event) {
			input[event.code] = false;
		},
		mouseDown: function(event) {
			switch(event.which) {
			case 1:
				input["LMB"] = true;
				break;
			case 2:
				input["MMB"] = true;
				break;
			case 3:
				input["RMB"] = true;
				break;
			default:
				break;
			}
		},
		mouseUp: function(event) {
			switch(event.which) {
			case 1:
				input["LMB"] = false;
				break;
			case 2:
				input["MMB"] = false;
				break;
			case 3:
				input["RMB"] = false;
				break;
			default:
				break;
			}
		},
		mouseMove: function(event) {
			if(input["RMB"]) {
				// Right-click pans the camera
				console.log("PAN");
			}
			if(input["MMB"]) {
				// Middle-click orbits the camera
				console.log("ORBIT");
			}
		},
		update: function() {
			var speed = (input["ShiftLeft"] || input["ShiftRight"]) ? 6 : 2;
			if(input["KeyW"]) {
				c.translateZ(-speed);
			}
			if(input["KeyA"]) {
				c.translateX(-speed);
			}
			if(input["KeyS"]) {
				c.translateZ(speed);
			}
			if(input["KeyD"]) {
				c.translateX(speed);
			}
			if(input["KeyQ"]) {
				c.translateY(speed);
			}
			if(input["KeyZ"]) {
				c.translateY(-speed);
			}
			if(input["KeyO"]) {
				reset();
			}
		}
	};
}

function cameraControl(c, ch)
{
  var distance = c.position.length();
  var q, q2;

  switch (ch)
  {

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
