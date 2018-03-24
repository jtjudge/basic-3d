
Basic3D.loadModule("Input", function (Bindings) {

  var swap = null;

  var mode = "EDIT";
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

  function handle(list, keycode, pressed) {
    if(keycode !== undefined && pressed !== undefined) {
      Bindings.fire(keycode, pressed);
    }
    handlers[list].forEach(function (handler) {
      handler();
    });
    if (swap === null) return;
    console.log(mode + " --> " + swap);
    mode = swap;
    swap = null;
    handlers.onmode.forEach(function (handler) {
      handler();
    });
  }

  function keydown(event) {
    event.preventDefault();
    handle("onkeydown", event.code, true);
  }

  function keyup(event) {
    handle("onkeyup", event.code, false);
  }

  function mousedown(event) {
    event.preventDefault();
    var menu = event.path.some(function(el) {
      return el.className !== undefined 
        && el.className.indexOf("menu") > -1;
    });
    if (!menu) handle("onmousedown", mouseEvents[event.which], true);
  }

  function mouseup(event) {
    event.preventDefault();
    handle("onmouseup", mouseEvents[event.which], false);
  }

  function mousemove(event) {
    var rect = container.getBoundingClientRect();
    coords.x2 = event.clientX - rect.left;
    coords.y2 = event.clientY - rect.top;
    handle("onmousemove");
  }

  function mousewheel(event) {
    event.preventDefault();
    scroll = event.deltaY;
    handle("onmousewheel");
  }

  function resize() {
    handle("onresize");
  }

  return {
    update: function () {
      coords.x1 = coords.x2;
      coords.y1 = coords.y2;
      scroll = 0;
    },
    mode: function (name) {
      return (name === undefined) ? mode : name === mode;
    },
    coords: function () { return coords; },
    scroll: function () { return scroll; },
    register: function (items) {
      for (var i in items) {
        if (handlers[i] === undefined) {
          throw ("ERROR: Unrecognized listener '" + i + "'");
        }
        handlers[i].push(items[i]);
      }
    },
    setMode: function (name) {
      swap = name;
    },
    action: function (name) {
      return Bindings.action(name);
    },
    addKeyBinding: function (key, action, display) {
      Bindings.register({
        code: action,
        display: display,
        key: key
      });
    },
    removeKeyBinding: Bindings.removeBinding,
    addInvertBinding: function (key, action) {
      Bindings.register({
        code: action,
        key: key,
        invert: true
      });
    }
  };

});
