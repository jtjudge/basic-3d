const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;
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
        }
      ]
    },
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