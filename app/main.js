const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, ipcMain} = electron;
const Menu = electron.Menu;
// Set environment
process.env.NODE_ENV = "development";

let mainWindow;

var cdi = ["CAM_DOLLY_IN", "KeyW"];
var cdo = ["CAM_DOLLY_OUT", "KeyS"];
var ctl = ["CAM_TRUCK_LEFT", "KeyA"];
var ctr = ["CAM_TRUCK_RIGHT", "KeyD"];
var cpu = ["CAM_PEDESTAL_UP", "KeyQ"];
//var cpd = ["CAM_PEDESTAL_DOWN", "KeyZ"];
var cr = ["CAM_RESET", "KeyO"];
var ctf1 = ["CAM_TILT_FREE", "LMB"];
var com1 = ["CAM_ORBIT_MOD", "LMB"];
var com2 = ["CAM_ORBIT_MOD", "MMB"];
var ctf2 = ["CAM_TILT_FREE", "MMB"];
var ctf3 = ["CAM_TILT_FREE", "RMB"];
var csm1 = ["CAM_SPEED_MOD", "ShiftLeft"];
var csm2 = ["CAM_SPEED_MOD", "ShiftRight"];
var ctu = ["CAM_TILT_UP", "KeyI"];
var ctd = ["CAM_TILT_DOWN", "KeyK"];
var ctiltl = ["CAM_TILT_LEFT", "KeyJ"];
var ctiltr = ["CAM_TILT_RIGHT", "KeyL"];
var com3 = ["CAM_ORBIT_MOD", "Space"];
var tvm = ["TOGGLE_VERTEX_MODE", "KeyV"];
var pv = ["PLACE_VERTEX", "LMB"];
var pe = ["PLACE_EDGE", "KeyE"];
var pf = ["PLACE_FACE", "KeyF"];
var sg = ["SELECT_GEOM", "LMB"];
var msm1 = ["MULT_SELECT_MOD", "ShiftLeft"];
var msm2 = ["MULT_SELECT_MOD", "ShiftRight"];

app.on("ready", function () {
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
          click: () => { app.quit() }
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
          click: () => { mainWindow.toggleDevTools() },
        },
        {
          label: 'Reload',
          click: () => { mainWindow.reload() },
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
              click: () => { changeWindowColor('red') }
            },
            {
              label: 'Blue',
              click: () => { changeWindowColor('blue') }
            },
            {
              label: 'Green',
              click: () => { changeWindowColor('green') }
            },
          ]
        },
        {
          label: 'Change Keybinds',
          submenu: [
            {
              label: 'Dolly In',
              click: () => {changeKeyBind(cdi)}
            },
            {
              label: 'Dolly Out',
              click: () => {changeKeyBind(cdo)}
            },
            {
              label: 'Truck Left',
              click: () => {changeKeyBind(ctl)}
            },
            {
              label: 'Truck Right',
              click: () => {changeKeyBind(ctr)}
            },
            {
              label: 'Pedestal Up',
              click: () => {changeKeyBind(cpu)}
            },
            {
              label: 'Pedestal Down',
              click: () => {changeKeyBind(cpd)}
            },
            {
              label: 'Pan and Tilt (Press and Hold)',
              click: () => {changeKeyBind(ctf1)}
            },
            {
              label: 'Alt Pan Left',
              click: () => {changeKeyBind(ctiltl)}
            },
            {
              label: 'Alt Pan Right',
              click: () => {changeKeyBind(ctiltr)}
            },
            {
              label: 'Alt Tilt Up',
              click: () => {changeKeyBind(ctu)}
            },
            {
              label: 'Alt Tilt Down',
              click: () => {changeKeyBind(ctd)}
            },
            {
              label: 'Orbit (Press and Hold)',
              click: () => {changeKeyBind(com1)}
            },
            {
              label: 'Speed Modifier (Press and Hold)',
              click: () => {changeKeyBind(csm1)}
            },
            {
              label: 'Reset Camera',
              click: () => {changeKeyBind(cr)}
            },
            {
              label: 'Toggle Vertex Mode',
              click: () => {changeKeyBind(tvm)}
            },
            {
              label: 'Create Vertex',
              click: () => {changeKeyBind(pv)}
            },
            {
              label: 'Select Vertices',
              click: () => {changeKeyBind(sg)}
            },
            {
              label: 'Create Edge',
              click: () => {changeKeyBind(pe)}
            },
            {
              label: 'Create Face',
              click: () => {changeKeyBind(pf)}
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
function changeWindowColor(color) {
  switch (color) {
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

  function changeKeyBind(keyBind){
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

    mainWindow.webContents.send('remove_key_binding', keyBind);

    console.log("keybinds removed");

    function onmousedown(input) {
      console.log("main: " + input);
      keyBind[1] = input;
      //event.preventDefault();
      //var code = mouseEvents[event.which];
      mainWindow.webContents.send('add_key_binding', keyBind);
      //InputHandling.addKeyBinding(action, input);
      child.close();
    }

    function onkeydown(input) {
      console.log("main: " + input);
      keyBind[1] = input;
      mainWindow.webContents.send('add_key_binding', keyBind);
      //InputHandling.addKeyBinding(action, input);
      child.close();
    }

    //mainWindow.webContents.send('get_bindings');
  }

  //ipcMain.on('get_bindings_recieved', (event, arg) => {
    // console.log("main: " + arg);
    //
    // var bindings = arg;
    // var index = 0;
    // var found = false;

    // mainWindow.webContents.send('remove_key_binding', action);
    //
    // function onmousedown(input) {
    //   console.log("main: " + input);
    //   //event.preventDefault();
    //   //var code = mouseEvents[event.which];
    //   mainWindow.webContents.send('add_key_binding', action, input);
    //   //InputHandling.addKeyBinding(action, input);
    //   child.close();
    // }
    //
    // function onkeydown(input) {
    //   console.log("main: " + input);
    //   mainWindow.webContents.send('add_key_binding', action, input);
    //   //InputHandling.addKeyBinding(action, input);
    //   child.close();
    // }
  //});

    function resetKeyBinds(){
      //var binding;

    // mainWindow.webContents.send('get_bindings');
    //
    // ipcMain.on('get_bindings_recieved', (event, arg) => {
    //   var bindings = arg;
    mainWindow.webContents.send('remove_key_binding', cdi);
    mainWindow.webContents.send('remove_key_binding', cdo);
    mainWindow.webContents.send('remove_key_binding', ctl);
    mainWindow.webContents.send('remove_key_binding', ctr);
    mainWindow.webContents.send('remove_key_binding', cpu);
    mainWindow.webContents.send('remove_key_binding', cr);
    mainWindow.webContents.send('remove_key_binding', ctf1);
    mainWindow.webContents.send('remove_key_binding', com1);
    mainWindow.webContents.send('remove_key_binding', com2);
    mainWindow.webContents.send('remove_key_binding', ctf2);
    mainWindow.webContents.send('remove_key_binding', ctf3);
    mainWindow.webContents.send('remove_key_binding', csm1);
    mainWindow.webContents.send('remove_key_binding', csm2);
    mainWindow.webContents.send('remove_key_binding', ctu);
    mainWindow.webContents.send('remove_key_binding', ctd);
    mainWindow.webContents.send('remove_key_binding', ctiltl);
    mainWindow.webContents.send('remove_key_binding', ctiltr);
    mainWindow.webContents.send('remove_key_binding', com3);
    mainWindow.webContents.send('remove_key_binding', tvm);
    mainWindow.webContents.send('remove_key_binding', pv);
    mainWindow.webContents.send('remove_key_binding', pe);
    mainWindow.webContents.send('remove_key_binding', pf);
    mainWindow.webContents.send('remove_key_binding', sg);
    mainWindow.webContents.send('remove_key_binding', msm1);
    mainWindow.webContents.send('remove_key_binding', msm2);

        //InputHandling.removeKeyBinding(InputHandling.bindings.keys[0], InputHandling.bindings.actions[0]);

      cdi[1] = "KeyW";
      cdo[1] = "KeyS";
      ctl[1] = "KeyA";
      ctr[1] = "KeyD"
      cpu[1] = "KeyQ";
      //var cpd = ["CAM_PEDESTAL_DOWN", "KeyZ"];
      cr[1] = "KeyO";
      ctf1[1] = "LMB";
      com1[1] = "LMB";
      com2[1] = "MMB";
      ctf2[1] = "MMB";
      ctf3[1] = "RMB";
      csm1[1] = "ShiftLeft";
      csm2[1] = "ShiftRight";
      ctu[1] = "KeyI";
      ctd[1] = "KeyK";
      ctiltl[1] = "KeyJ";
      ctiltr[1] = "KeyL";
      com3[1] = "Space";
      tvm[1] = "KeyV";
      pv[1] = "LMB";
      pe[1] = "KeyE";
      pf[1] = "KeyF";
      sg[1] = "LMB";
      msm1[1] = "ShiftLeft";
      msm2[1] = "ShiftRight";
      mainWindow.webContents.send('add_key_binding', cdi);
      //InputHandling.addKeyBinding("KeyW", "CAM_DOLLY_IN");
      mainWindow.webContents.send('add_key_binding', cdo);
      //InputHandling.addKeyBinding("KeyS", "CAM_DOLLY_OUT");
      mainWindow.webContents.send('add_key_binding', ctl);
      //InputHandling.addKeyBinding("KeyA", "CAM_TRUCK_LEFT");
      mainWindow.webContents.send('add_key_binding', ctr);
      //InputHandling.addKeyBinding("KeyD", "CAM_TRUCK_RIGHT");
      mainWindow.webContents.send('add_key_binding', cpu);
      //InputHandling.addKeyBinding("KeyQ", "CAM_PEDESTAL_UP");
      //mainWindow.webContents.send('add_key_binding', cpd);
      //InputHandling.addKeyBinding("KeyZ", "CAM_PEDESTAL_DOWN");

      mainWindow.webContents.send('add_key_binding', cr);
      //InputHandling.addKeyBinding("KeyO", "CAM_RESET");

      mainWindow.webContents.send('add_key_binding', ctf1);
      //InputHandling.addKeyBinding("LMB", "CAM_TILT_FREE");
      mainWindow.webContents.send('add_key_binding', com1);
      //InputHandling.addKeyBinding("LMB", "CAM_ORBIT_MOD");

      mainWindow.webContents.send('add_key_binding', ctf2);
      //InputHandling.addKeyBinding("MMB", "CAM_TILT_FREE");
      mainWindow.webContents.send('add_key_binding', com2);
      //InputHandling.addKeyBinding("MMB", "CAM_ORBIT_MOD");

      mainWindow.webContents.send('add_key_binding', ctf3);
      //InputHandling.addKeyBinding("RMB", "CAM_TILT_FREE");

      mainWindow.webContents.send('add_key_binding', csm1);
      //InputHandling.addKeyBinding("ShiftLeft", "CAM_SPEED_MOD");
      mainWindow.webContents.send('add_key_binding', csm2);
      //InputHandling.addKeyBinding("ShiftRight", "CAM_SPEED_MOD");

      mainWindow.webContents.send('add_key_binding', ctu);
      //InputHandling.addKeyBinding("KeyI", "CAM_TILT_UP");
      mainWindow.webContents.send('add_key_binding', ctd);
      //InputHandling.addKeyBinding("KeyK", "CAM_TILT_DOWN");
      mainWindow.webContents.send('add_key_binding', ctiltl);
      //InputHandling.addKeyBinding("KeyJ", "CAM_TILT_LEFT");
      mainWindow.webContents.send('add_key_binding', ctiltr);
      //InputHandling.addKeyBinding("KeyL", "CAM_TILT_RIGHT");

      mainWindow.webContents.send('add_key_binding', com3);
      //InputHandling.addKeyBinding("Space", "CAM_ORBIT_MOD");

      mainWindow.webContents.send('add_key_binding', tvm);
      //InputHandling.addKeyBinding("KeyV", "TOGGLE_VERTEX_MODE");
      mainWindow.webContents.send('add_key_binding', pv);
      //InputHandling.addKeyBinding("LMB", "PLACE_VERTEX");
      mainWindow.webContents.send('add_key_binding', pe);
      //InputHandling.addKeyBinding("KeyE", "PLACE_EDGE");
      mainWindow.webContents.send('add_key_binding', pf);
      //InputHandling.addKeyBinding("KeyF", "PLACE_FACE");

      mainWindow.webContents.send('add_key_binding', sg);
      //InputHandling.addKeyBinding("LMB", "SELECT_GEOM");
      mainWindow.webContents.send('add_key_binding', msm1);
      //InputHandling.addKeyBinding("ShiftLeft", "MULT_SELECT_MOD");
      mainWindow.webContents.send('add_key_binding', msm2);
      //InputHandling.addKeyBinding("ShiftRight", "MULT_SELECT_MOD");
    // });
}
