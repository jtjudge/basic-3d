
Basic3D.loadModule("BoxSelect", function (Geometry, Selection, Input, Display, Scene) {

  var layer, canvas, ctx, center, diff, down;

  layer = new Display.Layer();
  canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.style.backgroundColor = "rgba(0, 0, 0, 0)";

  ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

  center = { x: 0, y: 0 };
  diff = { x: 0, y: 0 };

  layer.addItem(canvas);
  layer.show();

  function bounded(pos) {
    var point = {
      x: (diff.x > 0) ? center.x : center.x + diff.x,
      y: (diff.y > 0) ? center.y : center.y + diff.y
    };
    var len = {
      x: Math.abs(diff.x),
      y: Math.abs(diff.y)
    };
    return pos.x > point.x
      && pos.x < point.x + len.x
      && pos.y > point.y
      && pos.y < point.y + len.y;
  }

  Input.register({
    onkeydown: function () {
      if (Input.action("TOGGLE_BOX_SELECT")) {
        if (Input.mode("EDIT")) {
          Input.setMode("BOX_SELECT");
        } else if (Input.mode("BOX_SELECT")) {
          Input.setMode("EDIT");
        }
      }
    },
    onmousedown: function () {
      if (!Input.mode("BOX_SELECT")) return;
      center.x = Input.coords().x2;
      center.y = Input.coords().y2;
      down = true;
    },
    onmousemove: function () {
      if (!Input.mode("BOX_SELECT") || !down) return;
      diff.x = Input.coords().x2 - center.x;
      diff.y = Input.coords().y2 - center.y;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(center.x, center.y, diff.x, diff.y);
    },
    onmouseup: function () {
      if (!Input.mode("BOX_SELECT")) return;
      var deselect = Input.action("BOX_DESELECT_MOD");
      Geometry.getVertices().forEach(function (vert) {
        var pos = Scene.getScreenPosition(vert.obj);
        if (bounded(pos)) Selection.toggleSelection(vert, !deselect);
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      down = false;
    },
    onmode: function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

  });

  Input.addKeyBinding("KeyB", "TOGGLE_BOX_SELECT", "Toggle Box Select");
  Input.addKeyBinding("ControlLeft", "BOX_DESELECT_MOD");
  Input.addKeyBinding("ControlRight", "BOX_DESELECT_MOD");


  return {};

});