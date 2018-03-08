
Basic3D.loadModule("Input", function () {

  var swapMode = function () { };

  var bindings = {};
  var inverts = {};

  var mode = "EDIT";
  var actions = [];
  var coords = {
    x1: 0, x2: 0,
    y1: 0, y2: 0
  };
  var scroll = 0;

  var handlers = {
    onkeydown: [],
    onkeyup: [],
    onmousedown: [],
    onmouseup: [],
    onmousemove: [],
    onmousewheel: [],
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
  document.onmousewheel = mousewheel;
  window.onresize = resize;

  function handle(list, code, down) {
    if (bindings[code] !== undefined) {
      bindings[code].forEach(function (action) {
        actions[action] = down;
      });
    }
    if (inverts[code] !== undefined) {
      inverts[code].forEach(function (action) {
        actions[action] = !down;
      });
    }
    handlers[list].forEach(function (handler) {
      handler();
    });
    swapMode();
  }

  function keydown(event) {
    handle("onkeydown", event.code, true);
  }

  function keyup(event) {
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
    coords.x2 = event.clientX - rect.left;
    coords.y2 = event.clientY - rect.top;
    handlers.onmousemove.forEach(function (handler) {
      handler();
    });
  }

  function mousewheel(event) {
    event.preventDefault();
    scroll = event.deltaY;
    handlers.onmousewheel.forEach(function (handler) {
      handler();
    });
  }

  function resize() {
    handlers.onresize.forEach(function (handler) {
      handler();
    });
  }

  return {
    bindings: function () {
      return bindings;
    },
    mode: function (name) {
      return (name === undefined) ? mode : name === mode;
    },
    action: function (name) {
      return actions[name];
    },
    coords: function () {
      return coords;
    },
    scroll: function () {
      return scroll;
    },
    register: function (items) {
      for (var i in items) {
        if (handlers[i] !== undefined) {
          handlers[i].push(items[i]);
        } else {
          throw ("ERROR: Unrecognized listener '" + i + "'");
        }
      }
    },
    update: function () {
      handlers.onupdate.forEach(function (handler) {
        handler();
      });
      coords.x1 = coords.x2;
      coords.y1 = coords.y2;
      scroll = 0;
    },
    setMode: function (name) {
      swapMode = function () {
        console.log(mode + " --> " + name);
        mode = name;
        handlers.onmode.forEach(function (handler) {
          handler();
        });
        swapMode = function () { };
      };
    },
    addKeyBinding: function (key, action) {
      var index;
      if (inverts[key] !== undefined) {
        index = inverts[key].findIndex(function (a) {
          return a === action;
        });
        if (index > -1) {
          throw ("ERROR: Binding for existing invert '" + key + " --> " + action + "' attempted");
          return false;
        }
      }
      if (bindings[key] === undefined) {
        bindings[key] = [];
      }
      if (actions[action] === undefined) {
        actions[action] = false;
      }
      index = bindings[key].findIndex(function (a) {
        return a === action;
      });
      if (index > -1) {
        throw ("ERROR: Duplicate binding '" + key + " --> " + action + "' attempted");
        return false;
      }
      bindings[key].push(action);
      return true;
    },
    removeKeyBinding: function (key, action) {
      if (bindings[key] === undefined) {
        throw ("ERROR: Key '" + key + "' not registered");
        return false;
      }
      if (actions[action] === undefined) {
        throw ("ERROR: Action '" + action + "'not registered");
        return false;
      }
      var index = bindings[key].findIndex(function (a) {
        return a === action;
      });
      if (index === -1) {
        throw ("ERROR: Binding '" + key + " --> " + action + "' not registered");
        return false;
      }
      bindings[key].splice(index, 1);
      return true;
    },
    addInvertBinding: function (key, action) {
      var index;
      if (bindings[key] !== undefined) {
        index = bindings[key].findIndex(function (a) {
          return a === action;
        });
        if (index > -1) {
          throw ("ERROR: Invert for existing binding '" + key + " --> " + action + "' attempted");
          return false;
        }
      }
      if (inverts[key] === undefined) {
        inverts[key] = [];
      }
      if (actions[action] === undefined) {
        actions[action] = true;
      }
      index = inverts[key].findIndex(function (a) {
        return a === action;
      });
      if (index > -1) {
        throw ("ERROR: Duplicate invert '" + key + " --> " + action + "' attempted");
        return false;
      }
      inverts[key].push(action);
      return true;
    }
  };

});