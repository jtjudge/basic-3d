//The basic idea behind this js file is to act as a mediator between main.js and InputHandling.js
Basic3D.loadModule("Keymap", function(Debug, InputHandling){

  var {ipcRenderer} = require('electron');

  var initialized = false;

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

  var interface = {
    init: function() {
      if(!assertInit(false)) return;
      initialized = true;
    }
  };

  ipcRenderer.on('get_bindings', function(event, arg) => {
    ipcRenderer.send('get_bindings_recieved', InputHandling.getKeyBindings());
  });

  ipcRenderer.on('remove_key_binding', function(event, arg1, arg2) => {
    InputHandling.removeKeyBinding(arg1, arg2);
  });

  ipcRenderer.on('add_key_binding', function(event, arg1, arg2) => {
    InputHandling.addKeyBinding(arg1, arg2);
  });
  
  return interface;
});
