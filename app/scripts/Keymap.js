
//The basic idea behind this js file is to act as a mediator between main.js and InputHandling.js
Basic3D.loadModule("Keymap", function(InputHandling){

  const {ipcRenderer} = require("electron");

  var initialized = false;

  function assertInit(val) {
    if(initialized && !val) {
      return false;
    } else if(!initialized && val) {
      return false;
    }
    return true;
  }

  // ipcRenderer.on('get_bindings', (event, arg) => {
  //   console.log("ipcRenderer");
  //   var bindings = InputHandling.getKeyBindings();
  //
  //   event.sender.send('get_bindings_recieved', InputHandling.getKeyBindings());
  // });

  ipcRenderer.on('remove_key_binding', (event, arg) => {
    console.log("remove key bindings");

    InputHandling.removeKeyBinding(arg[0], arg[1]);
  });

  ipcRenderer.on('add_key_binding', (event, arg1, arg2) => {
    InputHandling.addKeyBinding(arg2, arg1);
  });

  var interface = {
    init: function() {
      if(!assertInit(false)) return;
      initialized = true;
    }
  };

  return interface;
});
