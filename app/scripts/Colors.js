
Basic3D.loadModule("Colors", function () {

  var interface = {
    apply: function (change) {
      interface[change.name] = change.color;
    },
    VERTEX: 0xffffff,
    EDGE: 0xffffff,
    FACE: 0xffffff,
    VERTEX_SELECT: 0xff0000,
    EDGE_SELECT: 0xff0000,
    FACE_SELECT: 0xff0000,
    VERTEX_MARKER: 0x00ff00
  };

  return interface;

});

Basic3D.loadScript("ColorChange", function (Colors) {

  var script = function (data) {
    var div = document.createElement("div");
    div.setAttribute("class", "jscolor");
    document.body.appendChild(div);

    Colors.apply(data);
  };
  return script;
});