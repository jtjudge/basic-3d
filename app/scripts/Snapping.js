
Basic3D.loadModule("Snapping", function(Input, Geometry, Scene) {

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
            var geometry = new THREE.Geometry();
            geometry.vertices.push(center);
            geometry.vertices.push(pos);
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff}));
            Scene.add(line);
          }
          if(inRange(center.x, pos.x) && inRange(center.z, pos.z)) {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(center);
            geometry.vertices.push(pos);
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff}));
            Scene.add(line);
          }
          if(inRange(center.x, pos.x) && inRange(center.y, pos.y)) {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(center);
            geometry.vertices.push(pos);
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff}));
            Scene.add(line);
          }
        });
      }
    }
  });
