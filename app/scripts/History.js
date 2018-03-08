
Basic3D.loadModule("History", function (Input) {

  var undoHistory = [];
  var redoHistory = [];

  function undo() {
    if (undoHistory.length === 0) return;
    var move = undoHistory.pop();
    move.undo();
    redoHistory.push(move);
  }

  function redo() {
    if (redoHistory.length === 0) return;
    var move = redoHistory.pop();
    move.redo();
    undoHistory.push(move);
  }

  Input.register({
    onkeydown: function () {
      if (Input.action("HIST_MOD")) {
        if (Input.action("HIST_UNDO")) undo();
        if (Input.action("HIST_REDO")) redo();
      }
    }
  });

  Basic3D.loadScript("Undo", function () {
    return undo;
  });

  Basic3D.loadScript("Redo", function () {
    return redo;
  });

  Input.addKeyBinding("ControlLeft", "HIST_MOD");
  Input.addKeyBinding("ControlRight", "HIST_MOD");
  Input.addKeyBinding("KeyZ", "HIST_UNDO");
  Input.addKeyBinding("KeyY", "HIST_REDO");

  return {
    addMove: function (move) {
      redoHistory.length = 0;
      undoHistory.push(move);
    },
    startMove: function (vertices) {
      var moving = true;
      var states = vertices.map(function (v) {
        return {
          current: v.obj.position,
          previous: new THREE.Vector3().copy(v.obj.position)
        };
      });
      var updateVerts = function () {
        vertices.forEach(function (v) {
          v.edges.forEach(function (e) {
            e.obj.geometry.verticesNeedUpdate = true;
            e.obj.geometry.boundingSphere = null;
            e.obj.geometry.boundingBox = null;
          });
          v.faces.forEach(function (f) {
            f.obj.geometry.verticesNeedUpdate = true;
            f.obj.geometry.boundingSphere = null;
            f.obj.geometry.boundingBox = null;
          });
        });
      };
      var flipStates = function () {
        states.forEach(function (s) {
          var temp = new THREE.Vector3().copy(s.current);
          s.current.copy(s.previous);
          s.previous = temp;
        });
        updateVerts();
      };
      return {
        confirm: function () {
          if (!moving) {
            throw ("ERROR: No current move to confirm.");
          }
          moving = false;
          redoHistory.length = 0;
          undoHistory.push({
            undo: flipStates,
            redo: flipStates
          });
          updateVerts();
        },
        cancel: function () {
          if (!moving) {
            throw ("ERROR: No current move to cancel.");
          }
          moving = false;
          flipStates();
        },
        done: function () {
          return !moving;
        }
      }
    }
  };

});