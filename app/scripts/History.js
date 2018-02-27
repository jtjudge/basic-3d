
Basic3D.loadModule("History", function(Debug, InputHandling) {

  var undoHistory = [];
  var redoHistory = [];

  var interface = {
    init: function() {
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
    addMove(move) {
      if(!move.undo || !move.redo) {
        console.log("Invalid move");
        return;
      }
      redoHistory.length = 0;
      undoHistory.push(move);
      console.log("[ " + undoHistory.length + " | " + redoHistory.length + " ]");
    }
  };

  return interface;

});