  Basic3D.loadModule("GeometryRotation", function (InputHandling, Scene, Geometry, History){
    var SPEED = 0.05;

    var move;

    function active(mode){
      return (mode === "ROTATE_MODE" ||
        mode === "ROTATE_X" ||
        mode === "ROTATE_Y" ||
        mode === "ROTATE_Z");
    }

   InputHandling.register({
      onmousedown: function (input){

      },
      onmousemove: function (input){
        if (input.mode === "ROTATE_X") {
          Geometry.getSelected().forEach(function (v) {
            v.obj.rotateOnWorldAxis(new THREE.Vector3(1,0,0).normalize(), Math.PI / input.coords.y1);
            v.obj.geometry.verticesNeedUpdate = true;
            console.log(v.obj.position.x + " " + v.obj.position.y + " " + v.obj.position.z + " " + (input.coords.y2));
          });
        }
      },
      onkeydown: function (input){
        if (input.actions["TOGGLE_ROTATE_MODE"]) {
          if (!active(input.mode)) {
            if (Geometry.getSelected().length === 0) {
              InputHandling.mode("EDIT");
            } else {
              move = History.startMove(Geometry.getSelected());
              InputHandling.mode("ROTATE_MODE");
            }
          } else {
            move.cancel();
            InputHandling.mode("EDIT");
          }
        } else if (active(input.mode)) {
          if (input.actions["TOGGLE_ROTATE_X"]) {
            InputHandling.mode("ROTATE_X");
          }
          if (input.actions["TOGGLE_ROTATE_Y"]) {
            InputHandling.mode("ROTATE_Y");
          }
          if (input.actions["TOGGLE_ROTATE_Z"]) {
            InputHandling.mode("ROTATE_Z");
          }
        }
      },
      onmode: function (input){
        if (input.mode === "ROTATE_X") {
          Scene.showX(Geometry.getCenter());
        }
        if (input.mode === "ROTATE_Y") {
          Scene.showY(Geometry.getCenter());
        }
        if (input.mode === "ROTATE_Z") {
          Scene.showZ(Geometry.getCenter());
        }
      }
    });

    InputHandling.addKeyBinding("KeyR", "TOGGLE_ROTATE_MODE");
    InputHandling.addKeyBinding("KeyX", "TOGGLE_ROTATE_X");
    InputHandling.addKeyBinding("KeyY", "TOGGLE_ROTATE_Y");
    InputHandling.addKeyBinding("KeyZ", "TOGGLE_ROTATE_Z");
    InputHandling.addKeyBinding("LMB", "ROTATE_CONFIRM");

    return {};
 });