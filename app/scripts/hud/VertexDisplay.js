
Basic3D.loadModule("VertexDisplay", function (Input, Display, Geometry, Creation, Scene) {

  var layer, canvas, ctx;

  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");

  function setup() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
  }

  setup();

  layer = new Display.Layer();
  layer.addItem(canvas);
  layer.show();

  function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var selected = Geometry.getSelected();
    if (selected.length > 0 || Creation.active()) {
      var pos, text, obj, coords;
      
      pos = (Creation.active()) ? Creation.marker() : Geometry.getCenter();
      text = `(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`;
      coords = new THREE.Vector3().copy(pos).project(Scene.camera());

      coords.x *= canvas.width * 0.5;
      coords.x += canvas.width * 0.5;
      coords.y *= -canvas.height * 0.5;
      coords.y += canvas.height * 0.5;

      ctx.fillText(text, coords.x, coords.y);
    }
  }

  Input.register({
    onkeydown: refresh,
    onkeyup: refresh,
    onmousedown: refresh,
    onmousemove: refresh,
    onmousewheel: refresh,
    onresize: function() {
      setup();
      refresh();
    }
  });

  return {};

});