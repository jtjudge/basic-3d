const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, ipcMain} = electron;
const Menu = electron.Menu;
// Set environment
process.env.NODE_ENV = "development";

let mainWindow;

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
          label: 'Change Default colors',
          submenu: [
            {
              label: 'vertices',
              submenu: [
                {
                label: 'white',
                click: () => { changeColor('VERTEX', 0xffffff) }
                },
                {
                  label: 'green',
                  click: () => { changeColor('VERTEX', 0x00ff00) }
                },
                {
                  label: 'blue',
                  click: () => { changeColor('VERTEX', 0x0000ff) }
                },
              ]
            },
            {
              label: 'edges',
              submenu: [
                {
                label: 'white',
                click: () => { changeColor('EDGE', 0xffffff) }
                },
                {
                  label: 'green',
                  click: () => { changeColor('EDGE', 0x00ff00) }
                },
                {
                  label: 'blue',
                  click: () => { changeColor('EDGE', 0x0000ff) }
                },
              ]
            },
            {
              label: 'faces',
              submenu: [
                {
                  label: 'white',
                  click: () => { changeColor('FACE', 0xffffff) }
                  },
                  {
                    label: 'green',
                    click: () => { changeColor('FACE', 0x00ff00) }
                  },
                  {
                    label: 'blue',
                    click: () => { changeColor('FACE', 0x0000ff) }
                  },
              ]
            },
          ]
        }
      ]
    },
  ]);
  Menu.setApplicationMenu(menuSettings);
});

function changeColor(type, value){
  mainWindow.webContents.send('set_color', type, value);
}