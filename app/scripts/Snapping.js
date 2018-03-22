
Basic3D.loadModule("Snapping", function(Input, Scene, Geometry, Selection) {

  var tolerance = 1;

  function snap(vSource, vSnap) {
    if(vSource.x <== vSnap.x + tolerance && vSource.x >== vSnap.x - tolerance) {
      if(vSource.y <== vSnap.y + tolerance && vSource.y >== vSnap.y - tolerance) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(vSource);
        geometry.vertices.push(vSnap);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( {color: 0x0000ff} ));
        scene.add(line);
      }
      else if(vSource.z <== vSnap.z + tolerance && vSource.y >== vSnap.y - tolerance) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(vSource);
        geometry.vertices.push(vSnap);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( {color: 0x0000ff} ));
        scene.add(line);
      }
    }
    else if(vSource.y <== vSnap.y + tolerance && vSource.y >== vSnap.y - tolerance) {
      if(vSource.z <== vSnap.z + tolerance && vSource.y >== vSnap.y - tolerance) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(vSource);
        geometry.vertices.push(vSnap);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( {color: 0x0000ff} ));
        scene.add(line);
      }
    }
  }

  Input.register({
    onkeypress: function() {
      if(Input.action("SNAP") && (Input.mode("VERTEX_XZ") || Input.mode("VERTEX_Y") || Input.mode("TRANSLATE_X") || Input.mode("TRANSLATE_Y") || Input.mode("TRANSLATE_Z"))) {
        
      }
    }
  })
})
