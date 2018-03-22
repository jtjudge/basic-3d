
Basic3D.loadModule("Snapping", function(Input, Geometry) {

  Input.addKeyBinding("ControlLeft", "SNAP");
  Input.addKeyBinding("ControlRight", "SNAP");

  var tol = 1.0;

  function inRange(val, targ) {
    return val > targ - tol && val < targ + tol;
  }

  return {
    update: function() {
      if(Input.action("SNAP") && Geometry.getSelected().length > 0) {
        var center = Geometry.getCenter();
        var targets = Geometry.getVertices().filter(function(v) {
          return !v.selected;
        });
        targets.forEach(function (v) {
          var pos = v.obj.position;
          if(inRange(center.y, pos.y) && inRange(center.z, pos.z)) {
            //Snap on X
            console.log("SNAP Y on vert " + v.obj.id);
          }
          if(inRange(center.x, pos.x) && inRange(center.z, pos.z)) {
            //Snap on Y
            console.log("SNAP Y on vert " + v.obj.id);
          }
          if(inRange(center.x, pos.x) && inRange(center.y, pos.y)) {
            //Snap on Z
            console.log("SNAP Z on vert " + v.obj.id);
          }
        });
      }
    }
  });
