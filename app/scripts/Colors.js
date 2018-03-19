
Basic3D.loadModule("Colors", function () {

  var colors = {
    VERTEX: new THREE.Color(0xffffff),
    EDGE: new THREE.Color(0xffffff),
    FACE: new THREE.Color(0xffffff),
    VERTEX_SELECT: new THREE.Color(0xff0000),
    EDGE_SELECT: new THREE.Color(0xff0000),
    FACE_SELECT: new THREE.Color(0xff0000),
    VERTEX_MARKER: new THREE.Color(0x00ff00)
  };

  var interface = {
    apply: function (color) {
      interface[color.name] = color.value;
    },
    getColors: function () {
      var list = [];
      for(var c in colors) {
        list.push({ name: c, value: interface[c] });
      }
      return list;
    },
    reset: function () {
      for(var c in colors) {
        interface[c] = colors[c];
      }
    }
  };

  for(var c in colors) {
    interface[c] = colors[c];
  }

  return interface;

});