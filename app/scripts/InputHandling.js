
Basic3D.loadModule("InputHandling", function(Debug) {

  var initialized = false;

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

  function hasBinding(code) {
    if(bindings.keys[code] === undefined) {
      Debug.log("[InputHandling] No binding for " + code);
      return false;
    }
    return true;
  }

  function assertInit(val) {
    if(initialized && !val) {
      Debug.log("[InputHandling] ERROR: Module already initialized");
      return false;
    } else if(!initialized && val) {
      Debug.log("[InputHandling] ERROR: Module not initialized");
      return false;
    }
    return true;
  }

  function keydown(event) {
    if(!hasBinding(event.code)) return;
    bindings.keys[event.code].forEach(function(action) {
      input.actions[action] = true;
    });
    handlers.onkeydown.forEach(function(handler) {
      handler(input);
    });
  }

  function keyup(event){
    if(!hasBinding(event.code)) return;
    bindings.keys[event.code].forEach(function(action) {
      input.actions[action] = false;
    });
    handlers.onkeyup.forEach(function(handler) {
      handler(input);
    });
  }

  function mousedown(event) {
    event.preventDefault();
    var code = mouseEvents[event.which];
    if(!hasBinding(code)) return;
    bindings.keys[code].forEach(function(action) {
      input.actions[action] = true;
    });
    handlers.onmousedown.forEach(function(handler) {
      handler(input);
    });
  }

  function mouseup(event) {
    event.preventDefault();
    var code = mouseEvents[event.which];
    if(!hasBinding(code)) return;
    bindings.keys[code].forEach(function(action) {
      input.actions[action] = false;
    });
    handlers.onmouseup.forEach(function(handler) {
      handler(input);
    });
  }

  function mousemove(event) {
    var rect = container.getBoundingClientRect();
    input.coords.x1 = input.coords.x2;
    input.coords.y1 = input.coords.y2;
    input.coords.x2 = event.clientX - rect.left;
    input.coords.y2 = event.clientY - rect.top;
    handlers.onmousemove.forEach(function(handler) {
      handler(input);
    });
  }

  function resize() {
    handlers.onresize.forEach(function(handler) {
      handler(input);
    });
  }

  var interface = {
    init: function() {
      if(!assertInit(false)) return;
      initialized = true;
      document.onkeydown = keydown;
      document.onkeyup = keyup;
      document.onmousedown = mousedown;
      document.onmouseup = mouseup;
      document.onmousemove = mousemove;
      window.onresize = resize;
    },
    register: function(items) {
      if(!assertInit(true)) return;
      if(items.onkeydown) handlers.onkeydown.push(items.onkeydown);
      if(items.onkeyup) handlers.onkeyup.push(items.onkeyup);
      if(items.onmousedown) handlers.onmousedown.push(items.onmousedown);
      if(items.onmouseup) handlers.onmouseup.push(items.onmouseup);
      if(items.onmousemove) handlers.onmousemove.push(items.onmousemove);
      if(items.onresize) handlers.onresize.push(items.onresize);
      if(items.onupdate) handlers.onupdate.push(items.onupdate);
      if(items.onmode) handlers.onmode.push(items.onmode);
    },
    update: function() {
      if(!assertInit(true)) return;
      handlers.onupdate.forEach(function(handler) {
        handler(input);
      });
    },
    mode: function(name) {
      if(!assertInit(true)) return;
      input.mode = name;
      handlers.onmode.forEach(function(handler) {
        handler(input);
      });
    },
    getKeyBindings: function() {
      return bindings;
    },
    addKeyBinding: function(key, action) {
      if(!bindings.keys[key]) {
        bindings.keys[key] = [];
      }
      if(!bindings.actions[action]) {
        bindings.actions[action] = false;
      }
      var index = bindings.keys[key].findIndex(function(a) {
        return a === action;
      });
      if(index > -1) {
        Debug.log("[KeyBindings] Duplicate key binding '" +
          key + " --> " + action + "' attempted");
        return false;
      }
      bindings.keys[key].push(action);
      return true;
    },
    removeKeyBinding: function(key, action) {
      if(!bindings.keys[key] === undefined) {
        Debug.log("[KeyBindings] Key '" + key + "' not registered");
        return false;
      }
      if(bindings.actions[action] === undefined) {
        Debug.log("[KeyBindings] Action '" + action + "' not registered");
        return false;
      }
      var index = bindings.keys[key].findIndex(function(a) {
        return a === action;
      });
      if(index === -1) {
        Debug.log("[KeyBindings] Key binding '" +
          key + " --> " + action + "' not registered");
        return false;
      }
      bindings.keys[key].splice(index, 1);
      return true;
    }
  };

  return interface;

});
