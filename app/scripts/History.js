
Basic3D.loadModule("History", function(Debug, InputHandling) {

  var undoHistory = [];
  var redoHistory = [];

  var interface = {
    init: function () {
      InputHandling.register({
        onkeydown: function(input) {
          if(input.actions["HIST_MOD"]) {
            if(input.actions["HIST_UNDO"]) {
              if(undoHistory.length === 0) return;
              var move = undoHistory.pop();
              move.undo();
              redoHistory.push(move);
              console.log("[ " + undoHistory.length + " | " + redoHistory.length + " ]");
            } else if(input.actions["HIST_REDO"]) {
              if(redoHistory.length === 0) return;
              var move = redoHistory.pop();
              move.redo();
              undoHistory.push(move);
              console.log("[ " + undoHistory.length + " | " + redoHistory.length + " ]");
            }
          }
        }
      });
      InputHandling.addKeyBinding("ControlLeft", "HIST_MOD");
      InputHandling.addKeyBinding("ControlRight", "HIST_MOD");
      InputHandling.addKeyBinding("KeyZ", "HIST_UNDO");
      InputHandling.addKeyBinding("KeyY", "HIST_REDO");
    },
    addMove: function (move) {
      if(!move.undo || !move.redo) {
        console.log("Invalid move");
        return;
      }
      redoHistory.length = 0;
      undoHistory.push(move);
      console.log("[ " + undoHistory.length + " | " + redoHistory.length + " ]");
    },
    startMove: function (vertices) {
      console.log("Move started");
      var moving = true;
      var states = vertices.map(function(v) {
        return {
          current: v.obj.position,
          previous: new THREE.Vector3().copy(v.obj.position)
        };
      });
      var flipStates = function() {
        states.forEach(function(s) {
          var temp = new THREE.Vector3().copy(s.current);
          s.current.copy(s.previous);
          s.previous = temp;
        });
        vertices.forEach(function(v) {
          v.edges.forEach(function (e) {
            e.obj.geometry.verticesNeedUpdate = true;
          });
          v.faces.forEach(function (f) {
            f.obj.geometry.verticesNeedUpdate = true;
          });
        });
      };
      return {
        confirm: function () {
          if(!moving) return;
          moving = false;
          redoHistory.length = 0;
          undoHistory.push({
            undo: flipStates,
            redo: flipStates
          });
          console.log("Move confirmed");
          console.log("[ " + undoHistory.length + " | " + redoHistory.length + " ]");
        },
        cancel: function() {
          if(!moving) return;
          moving = false;
          flipStates();
          console.log("Move cancelled");
        }
      }
    }
  };

  return interface;

});