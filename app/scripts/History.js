
Basic3D.loadModule("History", function(Debug, Geometry, InputHandling) {

  var history = [];
  var before;

  function capture(vertices) {
    return vertices.map(function(v) {
      return {
        id: v.obj.id,
        position: new THREE.Vector3().copy(v.obj.position)
      };
    })
  }

  function undo() {
    console.log("UNDO");
  }

  function redo() {
    console.log("REDO");
  }

  var interface = {
    init: function() {
      InputHandling.register({
        onkeydown: function(input) {
          if(input.actions["HIST_MOD"] && input.actions["HIST_UNDO"]) {
            undo();
          }
          if(input.actions["HIST_MOD"] && input.actions["HIST_REDO"]) {
            redo();
          }
        }
      });
      InputHandling.addKeyBinding("ControlLeft", "HIST_MOD");
      InputHandling.addKeyBinding("ControlRight", "HIST_MOD");
      InputHandling.addKeyBinding("KeyZ", "HIST_UNDO");
      InputHandling.addKeyBinding("KeyY", "HIST_REDO");
    },
    startMove: function() {
      if(before) return;
      before = capture(Geometry.getSelected());
      console.log("Move started");
    },
    confirmMove: function() {
      if(!before) return;
      history.push({
        before: before,
        after: capture(Geometry.getSelected())
      });
      before = null;
      console.log("Move finished");
    },
    cancelMove: function() {
      if(!before) return;
      Geometry.getSelected().forEach(function(v) {
        var prevState = before.find(function(b) {
          return b.id === v.obj.id;
        });
        v.obj.position.copy(prevState.position);
      });
      console.log("Move cancelled");
    }
  };

  return interface;

});