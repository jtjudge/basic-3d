
Basic3D.loadModule("InputHandling", function () {

  // Mechanism to delay mode swap until
  // all keydown/mousedown handlers are fired
  var swapMode = function() {};

  var bindings = {
    keys: {},
    actions: {}
  };

  var input = {
    mode: "EDIT",
    actions: bindings.actions,
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

  function noBinding(code) {
    return bindings.keys[code] === undefined;
  }

  function keydown(event) {
    if (noBinding(event.code)) return;
    bindings.keys[event.code].forEach(function (action) {
      input.actions[action] = true;
    });
    handlers.onkeydown.forEach(function (handler) {
      handler(input);
    });
    swapMode();
  }

  function keyup(event){
    if(noBinding(event.code)) return;
    bindings.keys[event.code].forEach(function(action) {
      input.actions[action] = false;
    });
    handlers.onkeyup.forEach(function (handler) {
      handler(input);
    });
  }

  function mousedown(event) {
    event.preventDefault();
    var code = mouseEvents[event.which];
    if (noBinding(code)) return;
    bindings.keys[code].forEach(function (action) {
      input.actions[action] = true;
    });
    handlers.onmousedown.forEach(function (handler) {
      handler(input);
    });
    swapMode();
  }

  function mouseup(event) {
    event.preventDefault();
    var code = mouseEvents[event.which];
    if (noBinding(code)) return;
    bindings.keys[code].forEach(function (action) {
      input.actions[action] = false;
    });
    handlers.onmouseup.forEach(function (handler) {
      handler(input);
    });
  }

  function mousemove(event) {
    var rect = container.getBoundingClientRect();
    input.coords.x1 = input.coords.x2;
    input.coords.y1 = input.coords.y2;
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
      if (items.onkeydown) handlers.onkeydown.push(items.onkeydown);
      if (items.onkeyup) handlers.onkeyup.push(items.onkeyup);
      if (items.onmousedown) handlers.onmousedown.push(items.onmousedown);
      if (items.onmouseup) handlers.onmouseup.push(items.onmouseup);
      if (items.onmousemove) handlers.onmousemove.push(items.onmousemove);
      if (items.onresize) handlers.onresize.push(items.onresize);
      if (items.onupdate) handlers.onupdate.push(items.onupdate);
      if (items.onmode) handlers.onmode.push(items.onmode);
    },
    update: function () {
      handlers.onupdate.forEach(function (handler) {
        handler(input);
      });
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
    getKeyBindings: function () {
      return bindings;
    },
    addKeyBinding: function (key, action) {
      if (!bindings.keys[key]) {
        bindings.keys[key] = [];
      }
      if (!bindings.actions[action]) {
        bindings.actions[action] = false;
      }
      var index = bindings.keys[key].findIndex(function (a) {
        return a === action;
      });
      if(index > -1) {
        console.log("ERROR: Duplicate binding '" + key + " --> " + action + "' attempted");
        return false;
      }
      bindings.keys[key].push(action);
      console.log("Added binding '" + key + " --> " + action + "'");
      return true;
    },
    removeKeyBinding: function (key, action) {
      if (!bindings.keys[key] === undefined) {
        console.log("ERROR: Key '" + key + "' not registered");
        return false;
      }
      if (bindings.actions[action] === undefined) {
        console.log("ERROR: Action '" + action + "'not registered");
        return false;
      }
      var index = bindings.keys[key].findIndex(function (a) {
        return a === action;
      });
      if(index === -1) {
        console.log("ERROR: Binding '" + key + " --> " + action + "' not registered");
        return false;
      }
      bindings.keys[key].splice(index, 1);
      console.log("Removed binding '" + key + " --> " + action + "'");
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