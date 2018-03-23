
Basic3D.loadModule("Snapping", function(Input, Geometry, Scene, Translation) {

  var line;

  function inRange(val, targ) {
    return val > targ - 1 && val < targ + 1;
  }

  function drawSnap(v1, v2) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff}));
    Scene.add(line);
  }

  Input.addKeyBinding("ControlLeft", "SNAP");
  Input.addKeyBinding("ControlRight", "SNAP");

  return {
    update: function() {
      if(Input.action("SNAP") && !Translation.snapped() && Geometry.getSelected().length > 0) {
        var center = Geometry.getCenter();
        var targets = Geometry.getVertices().filter(function(v) {
          return !v.selected;
        });
        targets.forEach(function (v) {
          var pos = v.obj.position;
          var xRanged = inRange(center.x, pos.x);
          var yRanged = inRange(center.y, pos.y);
          var zRanged = inRange(center.z, pos.z);
          if (yRanged && zRanged || xRanged && zRanged || xRanged && yRanged) {
            Translation.snap(new THREE.Vector3(
              (xRanged ? pos.x : center.x), 
              (yRanged ? pos.y : center.y), 
              (zRanged ? pos.z : center.z)
            ));
            drawSnap(Geometry.getCenter(), pos);
          }
        });
      } else if(!Input.action("SNAP") && Translation.snapped()) {
        Scene.remove(line);
        Translation.unsnap();
      }
    }
  };
});
