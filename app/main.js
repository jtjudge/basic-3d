const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, ipcMain} = electron;
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
          ]
        },
        {
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
      ]}
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
    var bindings;
    var index = 0;
    var found = false;

    ipcMain.send('get_bindings');

    ipcMain.on('get_bindings_recieved', (event, arg) => {
      bindings = arg;
    });

    while(index < bindings.actions.length)
    {
      if(bindings.actions[index] === action){
        ipcMain.send('remove_key_binding', bindings.keys[index], action);
        //InputHandling.removeKeyBinding(action, bindings.keys[index]);
      }
      else{
        index++;
      }
    }

      function mousedown(event) {
        event.preventDefault();
        var code = mouseEvents[event.which];
        ipcMain.send('add_key_binding', action, code);
        //InputHandling.addKeyBinding(action, input);
        child.close();
      }

      function keydown(event) {
        ipcMain.send('add_key_binding', action, event.code);
        //InputHandling.addKeyBinding(action, input);
        child.close();
      }
}

  function resetKeyBinds(){
    var binding;

    ipcMain.send('get_bindings');

    ipcMain.on('get_bindings_recieved', (event, arg) => {
      bindings = arg;
    });

      while(bindings.keys.length != 0)
      {
        ipcMain.send('remove_key_binding', bindings.keys[0], bindings.actions[0]);
        //InputHandling.removeKeyBinding(InputHandling.bindings.keys[0], InputHandling.bindings.actions[0]);
      }

      ipcMain.send('add_key_binding', "KeyW", "CAM_DOLLY_IN");
      //InputHandling.addKeyBinding("KeyW", "CAM_DOLLY_IN");
      ipcMain.send('add_key_binding', "KeyS", "CAM_DOLLY_OUT");
      //InputHandling.addKeyBinding("KeyS", "CAM_DOLLY_OUT");
      ipcMain.send('add_key_binding', "KeyA", "CAM_TRUCK_LEFT");
      //InputHandling.addKeyBinding("KeyA", "CAM_TRUCK_LEFT");
      ipcMain.send('add_key_binding', "KeyD", "CAM_TRUCK_RIGHT");
      //InputHandling.addKeyBinding("KeyD", "CAM_TRUCK_RIGHT");
      ipcMain.send('add_key_binding', "KeyQ", "CAM_PEDESTAL_UP");
      //InputHandling.addKeyBinding("KeyQ", "CAM_PEDESTAL_UP");
      ipcMain.send('add_key_binding', "KeyZ", "CAM_PEDESTAL_DOWN");
      //InputHandling.addKeyBinding("KeyZ", "CAM_PEDESTAL_DOWN");

      ipcMain.send('add_key_binding', "KeyO", "CAM_RESET");
      //InputHandling.addKeyBinding("KeyO", "CAM_RESET");

      ipcMain.send('add_key_binding', "LMB", "CAM_TILT_FREE");
      //InputHandling.addKeyBinding("LMB", "CAM_TILT_FREE");
      ipcMain.send('add_key_binding', "LMB", "CAM_ORBIT_MOD");
      //InputHandling.addKeyBinding("LMB", "CAM_ORBIT_MOD");

      ipcMain.send('add_key_binding', "MMB", "CAM_TILT_FREE");
      //InputHandling.addKeyBinding("MMB", "CAM_TILT_FREE");
      ipcMain.send('add_key_binding', "MMB", "CAM_ORBIT_MOD");
      //InputHandling.addKeyBinding("MMB", "CAM_ORBIT_MOD");

      ipcMain.send('add_key_binding', "RMB", "CAM_TILT_FREE");
      //InputHandling.addKeyBinding("RMB", "CAM_TILT_FREE");

      ipcMain.send('add_key_binding', "ShiftLeft", "CAM_SPEED_MOD");
      //InputHandling.addKeyBinding("ShiftLeft", "CAM_SPEED_MOD");
      ipcMain.send('add_key_binding', "ShiftRight", "CAM_SPEED_MOD");
      //InputHandling.addKeyBinding("ShiftRight", "CAM_SPEED_MOD");

      ipcMain.send('add_key_binding', "KeyI", "CAM_TILT_UP");
      //InputHandling.addKeyBinding("KeyI", "CAM_TILT_UP");
      ipcMain.send('add_key_binding', "KeyK", "CAM_TILT_DOWN");
      //InputHandling.addKeyBinding("KeyK", "CAM_TILT_DOWN");
      ipcMain.send('add_key_binding', "KeyJ", "CAM_TILT_LEFT");
      //InputHandling.addKeyBinding("KeyJ", "CAM_TILT_LEFT");
      ipcMain.send('add_key_binding', "KeyL", "CAM_TILT_RIGHT");
      //InputHandling.addKeyBinding("KeyL", "CAM_TILT_RIGHT");

      ipcMain.send('add_key_binding', "Space", "CAM_ORBIT_MOD");
      //InputHandling.addKeyBinding("Space", "CAM_ORBIT_MOD");

      ipcMain.send('add_key_binding', "KeyV", "TOGGLE_VERTEX_MODE");
      //InputHandling.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
      ipcMain.send('add_key_binding', "LMB", "PLACE_VERTEX");
      //InputHandling.addKeyBinding("LMB", "PLACE_VERTEX");
      ipcMain.send('add_key_binding', "KeyE", "PLACE_EDGE");
      //InputHandling.addKeyBinding("KeyE", "PLACE_EDGE");
      ipcMain.send('add_key_binding', "KeyF", "PLACE_FACE");
      //InputHandling.addKeyBinding("KeyF", "PLACE_FACE");

      ipcMain.send('add_key_binding', "LMB", "SELECT_GEOM");
      //InputHandling.addKeyBinding("LMB", "SELECT_GEOM");
      ipcMain.send('add_key_binding', "ShiftLeft", "MULT_SELECT_MOD");
      //InputHandling.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
      ipcMain.send('add_key_binding', "ShiftRight", "MULT_SELECT_MOD");
      //InputHandling.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");
}
