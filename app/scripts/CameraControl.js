function addControls(c) {
	var camera = c;
	var input = [];
	var mouseCoords = { x: 0, y: 0 };
	
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
		mouseMove: function(coords) {
			if(input["RMB"] || input["MMB"]) {
				var angle = (input["ShiftLeft"] || input["ShiftRight"]) ? Math.PI / 60 : Math.PI / 180;
				var vector = new THREE.Vector3(coords.x - mouseCoords.x, mouseCoords.y - coords.y, 0);
				var axis = new THREE.Vector3(0, 0, 1).cross(vector).normalize();
				mouseCoords = coords;
				var q = new THREE.Quaternion().setFromAxsisAngle(axis, angle);
				if(input["RMB"]) {
					// Right-click pans the camera
					camera.setRotationFromQuaternion(q.multiply(camera.quaternion));
				} else {
					// Middle-click orbits the camera
					var distance = camera.position.length();
					camera.translateZ(-distance);
					camera.setRotationFromQuaternion(q.multiply(c.quaternion));
					camera.translateZ(distance);
				}
			}
		},
		update: function() {
			var speed = (input["ShiftLeft"] || input["ShiftRight"]) ? 6 : 2;
			if(input["KeyW"]) {
				camera.translateZ(-speed);
			}
			if(input["KeyA"]) {
				camera.translateX(-speed);
			}
			if(input["KeyS"]) {
				camera.translateZ(speed);
			}
			if(input["KeyD"]) {
				camera.translateX(speed);
			}
			if(input["KeyQ"]) {
				camera.translateY(speed);
			}
			if(input["KeyZ"]) {
				camera.translateY(-speed);
			}
			if(input["KeyO"]) {
				reset();
			}
		}
	};
}