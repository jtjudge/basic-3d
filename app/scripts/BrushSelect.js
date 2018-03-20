
Basic3D.loadModule("BrushSelect", function (Input, Scene, Selection, Geometry, Display) {

  var center, radius, scale, mod, down;

  var layer, canvas, ctx;

  layer = new Display.Layer();
  canvas = document.createElement("canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0, 255, 0, 0.5)";

  center = { x: 0, y: 0 };
  radius = 20;
  scale = 1;
  mod = 2;

  layer.addItem(canvas);
  layer.show();

  function bounded(pos) {
    var len = Input.action("BRUSH_SIZE_MOD") ? 
      radius * scale * mod : radius * scale;
    var dist = Math.sqrt(
      (pos.x - center.x) * (pos.x - center.x) + 
      (pos.y - center.y) * (pos.y - center.y)
    );
    return dist < len;
  }

  function spray() {
    var len = Input.action("BRUSH_SIZE_MOD") ? 
      radius * scale * mod : radius * scale;
    center.x = Input.coords().x2;
    center.y = Input.coords().y2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(center.x, center.y, len, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    if (down) {
      var deselected = Input.action("BRUSH_DESELECT_MOD");
      Geometry.getVertices().forEach(function (vert) {
        var pos = Scene.getScreenPosition(vert.obj);
        if (bounded(pos)) {
          Selection.toggleSelection(vert, !deselected);
        }
      });
    }
  }

  Input.register({
    onkeydown: function () {
      if (Input.action("TOGGLE_BRUSH_SELECT")) {
        if (Input.mode("EDIT")) {
          Input.setMode("BRUSH_SELECT");
        } else if (Input.mode("BRUSH_SELECT")) {
          Input.setMode("EDIT");
        }
      }
      if (Input.action("BRUSH_SIZE_MOD")) {
        if (Input.mode("BRUSH_SELECT")) {
          spray();
        }
      }
    },
    onkeyup: function () {
      if (!Input.action("BRUSH_SIZE_MOD")) {
        if (Input.mode("BRUSH_SELECT")) {
          spray();
        }
      }
    },
    onmousedown: function () {
      if (!Input.mode("BRUSH_SELECT")) return;
      down = true;
      ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
      spray();
    }, 
    onmousemove: function () {
      if (!Input.mode("BRUSH_SELECT")) return;
      spray();
    }, 
    onmouseup: function () {
      if (!Input.mode("BRUSH_SELECT")) return;
      down = false;
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      spray();
    },
    onmode: function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  Input.addKeyBinding("KeyC", "TOGGLE_BRUSH_SELECT", "Toggle Brush Select");
  Input.addKeyBinding("ControlLeft", "BRUSH_DESELECT_MOD");
  Input.addKeyBinding("ControlRight", "BRUSH_DESELECT_MOD");
  Input.addKeyBinding("ShiftLeft", "BRUSH_SIZE_MOD");
  Input.addKeyBinding("ShiftRight", "BRUSH_SIZE_MOD");

  return {
    setScale: function (val) {
      scale = val;
    },
    setModifier: function (val) {
      mod = val;
    }
  };

});

Basic3D.loadScript("ToggleBigBrush", function (BrushSelect) {
  var big = false;
  return function () {
    big = !big;
    BrushSelect.setScale((big) ? 2.0 : 1.0);
    BrushSelect.setModifier((big) ? 0.5 : 2.0);
  };
});