
Basic3D.loadModule("InputHandling", function () {

  // Mechanism to delay mode swap until
  // all keydown/mousedown handlers are fired
  var swapMode = function() {};

  var bindings = {};
  var inverts = {};

  var input = {
    mode: "EDIT",
    actions: [],
    coords: {
      x1: 0, x2: 0,
      y1: 0, y2: 0
    }
  };

  var handlers = {
    onkeydown: [],
    onkeyup: [],
    onmousedown: [],
    onmouseup: [],
    onmousemove: [],
    onresize: [],
    onupdate: [],
    onmode: []
  };

  var mouseEvents = {
    1: "LMB",
    2: "MMB",
    3: "RMB"
  };

  document.onkeydown = keydown;
  document.onkeyup = keyup;
  document.onmousedown = mousedown;
  document.onmouseup = mouseup;
  document.onmousemove = mousemove;
  window.onresize = resize;

  function handle(list, code, up) {
    if (bindings[code] !== undefined) {
      bindings[code].forEach(function (action) {
        input.actions[action] = up;
      });
    }
    if (inverts[code] !== undefined) {
      inverts[code].forEach(function (action) {
        input.actions[action] = !up;
      });
    }
    handlers[list].forEach(function (handler) {
      handler(input);
    });
    swapMode();
  }

  function keydown(event) {
    handle("onkeydown", event.code, true);
  }

  function keyup(event){
    handle("onkeyup", event.code, false);
  }

  function mousedown(event) {
    event.preventDefault();
    handle("onmousedown", mouseEvents[event.which], true); 
  }

  function mouseup(event) {
    event.preventDefault();
    handle("onmouseup", mouseEvents[event.which], false); 
  }

  function mousemove(event) {
    var rect = container.getBoundingClientRect();
    input.coords.x2 = event.clientX - rect.left;
    input.coords.y2 = event.clientY - rect.top;
    handlers.onmousemove.forEach(function (handler) {
      handler(input);
    });
  }

  function resize() {
    handlers.onresize.forEach(function (handler) {
      handler(input);
    });
  }

  return {
    register: function (items) {
      for(var i in items) {
        if(handlers[i] !== undefined) handlers[i].push(items[i]);
      }
    },
    update: function () {
      handlers.onupdate.forEach(function (handler) {
        handler(input);
      });
      input.coords.x1 = input.coords.x2;
      input.coords.y1 = input.coords.y2;
    },
    mode: function (name) {
      swapMode = function() {
        // Perform queued mode change
        input.mode = name;
        handlers.onmode.forEach(function (handler) {
          handler(input);
        });
        // After performing change, dequeue
        swapMode = function() {};
      };
    },
    addKeyBinding: function (key, action) {
      var index;
      if(inverts[key] !== undefined) {
        index = inverts[key].findIndex(function (a) {
          return a === action;
        });
        if(index > -1) {
          throw ("ERROR: Binding for existing invert '" + key + " --> " + action + "' attempted");
          return false;
        }
      }
      if (bindings[key] === undefined) {
        bindings[key] = [];
      }
      if (input.actions[action] === undefined) {
        input.actions[action] = false;
      }
      index = bindings[key].findIndex(function (a) {
        return a === action;
      });
      if(index > -1) {
        throw ("ERROR: Duplicate binding '" + key + " --> " + action + "' attempted");
        return false;
      }
      bindings[key].push(action);
      console.log("Added binding '" + key + " --> " + action + "'");
      return true;
    },
    removeKeyBinding: function (key, action) {
      if (bindings[key] === undefined) {
        throw ("ERROR: Key '" + key + "' not registered");
        return false;
      }
      if (input.actions[action] === undefined) {
        throw ("ERROR: Action '" + action + "'not registered");
        return false;
      }
      var index = bindings[key].findIndex(function (a) {
        return a === action;
      });
      if(index === -1) {
        throw ("ERROR: Binding '" + key + " --> " + action + "' not registered");
        return false;
      }
      bindings[key].splice(index, 1);
      console.log("Removed binding '" + key + " --> " + action + "'");
      return true;
    },
    addInvertBinding: function(key, action) {
      var index;
      if(bindings[key] !== undefined) {
        index = bindings[key].findIndex(function (a) {
          return a === action;
        });
        if(index > -1) {
          throw ("ERROR: Invert for existing binding '" + key + " --> " + action + "' attempted");
          return false;
        }
      }
      if (inverts[key] === undefined) {
        inverts[key] = [];
      }
      if (input.actions[action] === undefined) {
        input.actions[action] = true;
      }
      index = inverts[key].findIndex(function (a) {
        return a === action;
      });
      if(index > -1) {
        throw ("ERROR: Duplicate invert '" + key + " --> " + action + "' attempted");
        return false;
      }
      inverts[key].push(action);
      console.log("Added invert '" + key + " --> " + action + "'");
      return true;
    }
  };

});

Basic3D.loadScript("KeyBindingsMenu", function(InputHandling) {
  var script = function() {
    console.log("A Key bindings menu appears!");
  };
  return script;
});