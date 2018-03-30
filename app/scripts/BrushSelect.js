
Basic3D.loadModule("BrushSelect", function (Input, Controls, Scene, Selection, TipsDisplay, Geometry, Display) {

  var layer, canvas, ctx, center, radius, scale, mod, down;

  layer = new Display.Layer();
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");

  center = { x: 0, y: 0 };
  radius = 20;
  scale = 1;
  mod = 2;

  layer.addItem(canvas);
  layer.show();

  refresh();

  function refresh() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function bounded(pos) {
    var len = radius * scale * (Input.action("BRUSH_SIZE_MOD") ? mod : 1);
    var dist = Math.sqrt(
      (pos.x - center.x) * (pos.x - center.x) + 
      (pos.y - center.y) * (pos.y - center.y)
    );
    return dist < len;
  }

  function spray() {
    var deselected = Input.action("BRUSH_DESELECT_MOD");
    var targets = (Selection.mode("VERTEX")) ? Geometry.getVertices() :
      (Selection.mode("EDGE")) ? Geometry.getEdges() :
      (Selection.mode("FACE")) ? Geometry.getFaces() : [];
    targets.forEach(function (target) {
      var pos;
      if (target.type === "VERTEX") {
        pos = Scene.getScreenPosition(target.obj);
      } else {
        pos = new THREE.Vector3();
        target.obj.geometry.vertices.forEach(function (v) { 
          pos.add(v);
        });
        pos.multiplyScalar(1 / target.obj.geometry.vertices.length);
        pos.project(Scene.camera());
        pos.x *= canvas.width / 2;
        pos.x += canvas.width / 2;
        pos.y *= -canvas.height / 2;
        pos.y += canvas.height / 2;
      }
      if (bounded(pos)) Selection.toggleSelection(target, !deselected);
    });
  }

  function drawBrush() {
    center.x = Input.coords().x2;
    center.y = Input.coords().y2;
    ctx.fillStyle = (down) ? "rgba(0, 255, 0, 0.5)" : "rgba(0, 0, 255, 0.5)";
    var len = radius * scale * (Input.action("BRUSH_SIZE_MOD") ? mod : 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(center.x, center.y, len, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    if (down) spray();
  }

  Input.register({
    onkeydown: function () {
      if (Input.action("TOGGLE_BRUSH_SELECT")) {
        if (Input.mode("EDIT")) {
          Input.setMode("BRUSH_SELECT");
          Controls.disable(["orbit"]);
          drawBrush();
        } else if (Input.mode("BRUSH_SELECT")) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          Controls.enable(["orbit"]);
          Input.setMode("EDIT");
        }
      }
      if (Input.action("BRUSH_SIZE_MOD") && Input.mode("BRUSH_SELECT")) {
        drawBrush();
      }
    },
    onkeyup: function () {
      if (!Input.action("BRUSH_SIZE_MOD") && Input.mode("BRUSH_SELECT")) {
        drawBrush();
      }
    },
    onmousedown: function () {
      if (Input.mode("BRUSH_SELECT") && Input.action("BRUSH_SELECT_DOWN") && !down) {
        down = true;
        drawBrush();
      }
    }, 
    onmousemove: function () {
      if (Input.mode("BRUSH_SELECT")) drawBrush();
    }, 
    onmouseup: function () {
      if (Input.mode("BRUSH_SELECT") && !Input.action("BRUSH_SELECT_DOWN") && down) {
        down = false;
        drawBrush();
      }
    },
    onresize: refresh
  });

  Input.addKeyBinding("KeyC", "TOGGLE_BRUSH_SELECT", "Toggle Brush Select");
  Input.addKeyBinding("LMB", "BRUSH_SELECT_DOWN");
  Input.addKeyBinding("ControlLeft", "BRUSH_DESELECT_MOD");
  Input.addKeyBinding("ControlRight", "BRUSH_DESELECT_MOD");
  Input.addKeyBinding("ShiftLeft", "BRUSH_SIZE_MOD");
  Input.addKeyBinding("ShiftRight", "BRUSH_SIZE_MOD");

  TipsDisplay.registerMode({
    name: "BRUSH_SELECT",
    display: "Brush Select",
  });
  TipsDisplay.registerTip({
    mode: "BRUSH_SELECT",
    builder: function (get) {
      return `${get("PLACE_EDGE")} to create edge`;
    },
    condition: function () {
      return Geometry.getSelected().length === 2;
    }
  });
  TipsDisplay.registerTip({
    mode: "BRUSH_SELECT",
    builder: function (get) {
      return `${get("PLACE_FACE")} to create face`;
    },
    condition: function () {
      return Geometry.getSelected().length >= 3;
    }
  });
  TipsDisplay.registerTip({
    mode: "BRUSH_SELECT",
    builder: function (get) {
      return `${get("DELETE_GEOM")} to delete`;
    },
    condition: function () {
      return Geometry.getSelected().length > 0;
    }
  });
  TipsDisplay.registerTip({
    mode: "BRUSH_SELECT",
    builder: function (get) {
      return `${get("TOGGLE_BRUSH_SELECT")} to exit`
    }
  });
  TipsDisplay.registerTip({
    mode: "BRUSH_SELECT",
    builder: function (get) {
      var reaction = (Input.action("BRUSH_DESELECT_MOD")) ? "deselect" : "select";
      return `${get("BRUSH_SELECT_DOWN")} to ${reaction}`
    },
    condition: function () {
      return !Input.action("BRUSH_SELECT_DOWN");
    }
  });
  TipsDisplay.registerTip({
    mode: "BRUSH_SELECT",
    builder: function (get) {
      return `${get("BRUSH_DESELECT_MOD")} to invert select`
    },
    condition: function () {
      return !Input.action("BRUSH_DESELECT_MOD");
    }
  });
  TipsDisplay.registerTip({
    mode: "BRUSH_SELECT",
    builder: function (get) {
      return `${get("BRUSH_SIZE_MOD")} to change brush size`
    },
    condition: function () {
      return !Input.action("BRUSH_SIZE_MOD");
    }
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("TOGGLE_BRUSH_SELECT")} to brush select`
    }
  });

  return {
    setScale: function (val) { scale = val; },
    setModifier: function (val) { mod = val; }
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