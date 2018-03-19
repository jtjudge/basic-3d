
Basic3D.loadModule("Colors", function () {

  var colors = {
    VERTEX: 0xffffff,
    EDGE: 0xffffff,
    FACE: 0xffffff,
    VERTEX_SELECT: 0xff0000,
    EDGE_SELECT: 0xff0000,
    FACE_SELECT: 0xff0000,
    VERTEX_MARKER: 0x00ff00
  };

  var interface = {
    apply: function (change) {
      interface[change.name] = change.color;
    },
    getColors: function () {
      var list = [];
      for(var c in colors) {
        list.push({
          name: c,
          value: colors[c]
        });
      }
      return list;
    }
  };

  for(var c in colors) {
    interface[c] = colors[c];
  }

  return interface;

});