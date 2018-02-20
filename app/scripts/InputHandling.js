
function initInputHandling() {
  var input = [];
  var coords = {
    x1: 0, x2: 0,
    y1: 0, y2: 0
  };

  var handlers = {
    onkeydown: [],
    onkeyup: [],
    onmousedown: [],
    onmouseup: [],
    onmousemove: [],
    onresize: [],
    onupdate: []
  };

  var interface = {
    keydown: function(event) {
      input[event.code] = true;
      handlers.onkeydown.forEach(function(handler) {
        handler(input, coords);
      });
    },
    keyup: function(event){
      input[event.code] = false;
      handlers.onkeyup.forEach(function(handler) {
        handler(input, coords);
      });
    },
    mousedown: function(event) {
      event.preventDefault();
      switch (event.which) {
        case 1:
          input["LMB"] = true;
          break;
        case 2:
          input["MMB"] = true;
          break;
        case 3:
          input["RMB"] = true;
          break;
        default:
          break;
      }
      handlers.onmousedown.forEach(function(handler) {
        handler(input, coords);
      });
    },
    mouseup: function(event) {
      switch (event.which) {
        case 1:
          input["LMB"] = false;
          break;
        case 2:
          input["MMB"] = false;
          break;
        case 3:
          input["RMB"] = false;
          break;
        default:
          break;
      }
      handlers.onmouseup.forEach(function(handler) {
        handler(input, coords);
      });
    },
    mousemove: function(event) {
      var rect = container.getBoundingClientRect();
      coords.x1 = coords.x2;
      coords.y1 = coords.y2;
      coords.x2 = event.clientX - rect.left;
      coords.y2 = event.clientY - rect.top;
      handlers.onmousemove.forEach(function(handler) {
        handler(input, coords);
      });
    },
    resize: function() {
      handlers.onresize.forEach(function(handler) {
        handler(input, coords);
      });
    },
    update: function() {
      handlers.onupdate.forEach(function(handler) {
        handler(input, coords);
      });
    },
    register: function(items) {
      if(items.onkeydown) handlers.onkeydown.push(items.onkeydown);
      if(items.onkeyup) handlers.onkeyup.push(items.onkeyup);
      if(items.onmousedown) handlers.onmousedown.push(items.onmousedown);
      if(items.onmouseup) handlers.onmouseup.push(items.onmouseup);
      if(items.onmousemove) handlers.onmousemove.push(items.onmousemove);
      if(items.onresize) handlers.onresize.push(items.onresize);
      if(items.onupdate) handlers.onupdate.push(items.onupdate);
    }
  };

  // Activate listeners
  document.onkeydown = interface.keydown;
  document.onkeyup = interface.keyup;
  document.onmousedown = interface.mousedown;
  document.onmouseup = interface.mouseup;
  document.onmousemove = interface.mousemove;
  window.onresize = interface.resize;

  return interface;
}