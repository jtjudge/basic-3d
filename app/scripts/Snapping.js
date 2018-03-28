
Basic3D.loadModule("Snapping", function(Input, Geometry, Scene, Translation, Creation, TipsDisplay) {

  var lines = [];

  function inRange(val, targ) {
    return val > targ - 1 && val < targ + 1;
  }

  function shiftPos(verts, pos1, pos2) {
    var diff = new THREE.Vector3().copy(pos1);
    diff.sub(pos2);
    verts.forEach(function(v) {
      v.obj.position.add(diff);
      v.edges.forEach(function (e) {
        e.obj.geometry.verticesNeedUpdate = true;
      });
      v.faces.forEach(function (f) {
        f.obj.geometry.verticesNeedUpdate = true;
      });
    });
  }

  function drawSnap(v1, v2) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    var line = new THREE.Line(geometry, 
      new THREE.LineBasicMaterial({color: 0x0000ff}));
    Scene.add(line);
    lines.push(line);
  }

  function snap(pos1, pos2) {

    var xRanged = inRange(pos1.x, pos2.x);
    var yRanged = inRange(pos1.y, pos2.y);
    var zRanged = inRange(pos1.z, pos2.z);

    if (yRanged && zRanged || xRanged && zRanged || xRanged && yRanged) {

      var newPos = new THREE.Vector3(
        (xRanged ? pos2.x : pos1.x), 
        (yRanged ? pos2.y : pos1.y), 
        (zRanged ? pos2.z : pos1.z)
      );

      drawSnap(newPos, pos2);

      if (Translation.active()) {
        Translation.snap();
        shiftPos(Geometry.getSelected(), newPos, Geometry.getCenter());
      }

      if (Creation.active()) {
        Creation.snap();
        shiftPos([ Creation.markerObj() ], newPos, Creation.marker());
      }

    }

  }

  Input.addKeyBinding("ControlLeft", "SNAP");
  Input.addKeyBinding("ControlRight", "SNAP");

  TipsDisplay.registerTip({
    mode: "TRANSLATE",
    builder: function (get) {
      return `${get("SNAP")} to snap`;
    },
    condition: function () {
      return !Input.action("SNAP");
    }
  });

  TipsDisplay.registerTip({
    mode: "VERTEX",
    builder: function (get) {
      return `${get("SNAP")} to snap`;
    },
    condition: function () {
      return !Input.action("SNAP");
    }
  });


  return {
    update: function() {

      if(Input.action("SNAP")) {

        if (Translation.active() && !Translation.snapped()) {
          var center = Geometry.getCenter();
          Geometry.getVertices().filter(function(v) {
            return !v.selected;
          }).forEach(function (v) {
            snap(center, v.obj.position);
          });
        }
        
        if (Creation.active() && !Creation.snapped()) {
          var marker = Creation.marker();
          Geometry.getVertices().filter(function (v) {
            return !v.selected;
          }).forEach(function (v) {
            snap(marker, v.obj.position);
          });
        }

      } else {

        if (Translation.snapped()) Translation.unsnap();
        if (Creation.snapped()) Creation.unsnap();

        lines.forEach(function (line) {
          Scene.remove(line);
        });

        lines = [];

      }

    }
  };
});
