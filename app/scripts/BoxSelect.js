
Basic3D.loadModule("BoxSelect", function (Geometry, Selection, Input, Controls, Display, TipsDisplay, Scene) {

  var layer, canvas, ctx, center, diff, down;

  layer = new Display.Layer();
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");

  center = { x: 0, y: 0 };
  diff = { x: 0, y: 0 };

  layer.addItem(canvas);
  layer.show();

  refresh();

  function refresh() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  }

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
          Controls.disable(["orbit"]);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else if (Input.mode("BOX_SELECT")) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          Controls.enable(["orbit"]);
          Input.setMode("EDIT");
        }
      }
    },
    onmousedown: function () {
      if (Input.mode("BOX_SELECT") && Input.action("BOX_SELECT_DOWN") && !down) {
        center.x = Input.coords().x2;
        center.y = Input.coords().y2;
        down = true;
      }
    },
    onmousemove: function () {
      if (Input.mode("BOX_SELECT") && down) {
        diff.x = Input.coords().x2 - center.x;
        diff.y = Input.coords().y2 - center.y;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(center.x, center.y, diff.x, diff.y);
      }
    },
    onmouseup: function () {
      if (!Input.mode("BOX_SELECT")) return;
      var deselect = Input.action("BOX_DESELECT_MOD");
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
        if (bounded(pos)) Selection.toggleSelection(target, !deselect);
      });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      down = false;
    },
    onresize: refresh
  });

  Input.addKeyBinding("KeyB", "TOGGLE_BOX_SELECT", "Toggle Box Select");
  Input.addKeyBinding("LMB", "BOX_SELECT_DOWN");
  Input.addKeyBinding("ControlLeft", "BOX_DESELECT_MOD");
  Input.addKeyBinding("ControlRight", "BOX_DESELECT_MOD");

  TipsDisplay.registerMode({
    name: "BOX_SELECT",
    display: "Box Select"
  });

  TipsDisplay.registerTip({
    mode: "BOX_SELECT",
    builder: function (get) {
      var action, reaction;
      action = (Input.action("BOX_SELECT_DOWN")) ? "Drag + release " : "Hold ";
      action += get("BOX_SELECT_DOWN");
      reaction = (Input.action("BOX_DESELECT_MOD")) ? "deselect" : "select";
      return `${action} to ${reaction}`;
    }
  });
  TipsDisplay.registerTip({
    mode: "BOX_SELECT",
    builder: function (get) {
      return `${get("BOX_DESELECT_MOD")} to invert select`;
    },
    condition: function() {
      return !Input.action("BOX_DESELECT_MOD");
    }
  });
  TipsDisplay.registerTip({
    mode: "BOX_SELECT",
    builder: function (get) {
      return `${get("PLACE_EDGE")} to create edge`;
    },
    condition: function () {
      return Geometry.getSelected().length === 2;
    }
  });
  TipsDisplay.registerTip({
    mode: "BOX_SELECT",
    builder: function (get) {
      return `${get("PLACE_FACE")} to create face`;
    },
    condition: function () {
      return Geometry.getSelected().length >= 3;
    }
  });
  TipsDisplay.registerTip({
    mode: "BOX_SELECT",
    builder: function (get) {
      return `${get("DELETE_GEOM")} to delete`;
    },
    condition: function () {
      return Geometry.getSelected().length > 0;
    }
  });
  TipsDisplay.registerTip({
    mode: "BOX_SELECT",
    builder: function (get) {
      return `${get("TOGGLE_BOX_SELECT")} to exit`;
    }
  });

  TipsDisplay.registerTip({
    mode: "EDIT",
    builder: function (get) {
      return `${get("TOGGLE_BOX_SELECT")} for box select`;
    }
  });

  return {};

});