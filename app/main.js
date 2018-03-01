const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow} = electron;
const Menu = electron.Menu;
// Set environment
process.env.NODE_ENV = "development";

let mainWindow;

app.on("ready", function() {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "main.html"),
    protocol: "file:",
    slashes: true
  }));
  let menuSettings = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          click: () => {app.quit()}
        }
      ]
    },
    {
      label: 'Edit'
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Dev Tools',
          click: () => {mainWindow.toggleDevTools()},
        },
        {
          label: 'Reload',
          click: () => {mainWindow.reload()},
        }
      ]
    },
    {
      label: 'Preferences',
      submenu: [
        {
          label: 'Change Window Color',
          submenu: [
            {
              label: 'Red',
              click:  () => {changeWindowColor('red')}
            },
            {
              label: 'Blue',
              click:  () => {changeWindowColor('blue')}
            },
            {
              label: 'Green',
              click:  () => {changeWindowColor('green')}
            },
          ],

          label: 'Change Keybinds',
          submenu: [
            {
              label: 'Dolly In',
              click: () => {changeKeyBind("CAM_DOLLY_IN")}
            },
            {
              label: 'Dolly Out',
              click: () => {changeKeyBind("CAM_DOLLY_OUT")}
            },
            {
              label: 'Truck Left',
              click: () => {changeKeyBind("CAM_TRUCK_LEFT")}
            },
            {
              label: 'Truck Right',
              click: () => {changeKeyBind("CAM_TRUCK_RIGHT")}
            },
            {
              label: 'Pedestal Up',
              click: () => {changeKeyBind("CAM_PEDESTAL_UP")}
            },
            {
              label: 'Pedestal Down',
              click: () => {changeKeyBind("CAM_PEDESTAL_DOWN")}
            },
            {
              label: 'Pan and Tilt (Press and Hold)',
              click: () => {changeKeyBind("CAM_TILT_FREE")}
            },
            {
              label: 'Alt Pan Left',
              click: () => {changeKeyBind("CAM_TILT_LEFT")}
            },
            {
              label: 'Alt Pan Right',
              click: () => {changeKeyBind("CAM_TILT_RIGHT")}
            },
            {
              label: 'Alt Tilt Up',
              click: () => {changeKeyBind("CAM_TILT_UP")}
            },
            {
              label: 'Alt Tilt Down',
              click: () => {changeKeyBind("CAM_TILT_DOWN")}
            },
            {
              label: 'Orbit (Press and Hold)',
              click: () => {changeKeyBind("CAM_ORBIT_MOD")}
            },
            {
              label: 'Speed Modifier (Press and Hold)',
              click: () => {changeKeyBind("CAM_SPEED_MOD")}
            },
            {
              label: 'Reset Camera',
              click: () => {changeKeyBind("CAM_RESET")}
            },
            {
              label: 'Create Vertex',
              click: () => {changeKeyBind("PLACE_VERTEX")}
            },
            {
              label: 'Select Vertices',
              click: () => {changeKeyBind("MULT_SELECT_MOD")}
            },
            {
              label: 'Create Edge',
              click: () => {changeKeyBind("PLACE_EDGE")}
            },
            {
              label: 'Create Face',
              click: () => {changeKeyBind("PLACE_FACE")}
            },
            {
              label: 'Reset To Default',
              click: () => {resetKeyBinds()}
            },
          ]
        }
      ]
    },
  ]);
  Menu.setApplicationMenu(menuSettings);
});
//TODO: change this so that it actually does something
function changeWindowColor(color){
  switch(color){
    case 'red':
    console.log('red');
    break;
    case 'blue':
    console.log('blue');
    break;
    case 'green':
    console.log('greens');
    break;
  }
}

  function changeKeyBind(action){
    let child = new BrowserWindow({
      parent: mainWindow,
      title: 'Change KeyBind',
      darkTheme: true,
      show: false
    });

    child.loadURL(url.format({
      pathname: path.join(__dirname, "keybindChange.html"),
      protocol: "file:",
      slashes: true
    }));

    child.once('ready-to-show', () =>{
      child.show()
    });

    //InputHandling not working
    var bindings = InputHandling.getKeyBindings;
    var index = 0;
    var found = false;

    while(!found && index < bindings.actions.length)
    {
      if(bindings.actions[index] === action){
        found = true;
      }
      else{
        index++;
      }
    }

    InputHandling.removeKeyBinding(action, bindings.keys[index]);

    InputHandling.register({
      onmousedown: function(input) {
        InputHandling.addKeyBinding(action, input);
        child.close();
      },

      onkeydown: function(input) {
        InputHandling.addKeyBinding(action, input);
        child.close();
      }
    });
}

  function resetKeyBinds(){
      while(InputHandling.bindings.keys.length != 0)
      {
        InputHandling.removeKeyBinding(InputHandling.bindings.keys[0], InputHandling.bindings.actions[0]);
      }

      InputHandling.addKeyBinding("KeyW", "CAM_DOLLY_IN");
      InputHandling.addKeyBinding("KeyS", "CAM_DOLLY_OUT");
      InputHandling.addKeyBinding("KeyA", "CAM_TRUCK_LEFT");
      InputHandling.addKeyBinding("KeyD", "CAM_TRUCK_RIGHT");
      InputHandling.addKeyBinding("KeyQ", "CAM_PEDESTAL_UP");
      InputHandling.addKeyBinding("KeyZ", "CAM_PEDESTAL_DOWN");

      InputHandling.addKeyBinding("KeyO", "CAM_RESET");

      InputHandling.addKeyBinding("LMB", "CAM_TILT_FREE");
      InputHandling.addKeyBinding("LMB", "CAM_ORBIT_MOD");

      InputHandling.addKeyBinding("MMB", "CAM_TILT_FREE");
      InputHandling.addKeyBinding("MMB", "CAM_ORBIT_MOD");

      InputHandling.addKeyBinding("RMB", "CAM_TILT_FREE");

      InputHandling.addKeyBinding("ShiftLeft", "CAM_SPEED_MOD");
      InputHandling.addKeyBinding("ShiftRight", "CAM_SPEED_MOD");

      InputHandling.addKeyBinding("KeyI", "CAM_TILT_UP");
      InputHandling.addKeyBinding("KeyK", "CAM_TILT_DOWN");
      InputHandling.addKeyBinding("KeyJ", "CAM_TILT_LEFT");
      InputHandling.addKeyBinding("KeyL", "CAM_TILT_RIGHT");

      InputHandling.addKeyBinding("Space", "CAM_ORBIT_MOD");

      InputHandling.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
      InputHandling.addKeyBinding("LMB", "PLACE_VERTEX");
      InputHandling.addKeyBinding("KeyE", "PLACE_EDGE");
      InputHandling.addKeyBinding("KeyF", "PLACE_FACE");

      InputHandling.addKeyBinding("LMB", "SELECT_GEOM");
      InputHandling.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
      InputHandling.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");
}
