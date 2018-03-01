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
          label: 'Change Default colors',
          submenu: [
            {
              label: 'vertices',
              submenu: [
                {
                label: 'red',
                click: () => { setColorForEnt('vertices', '#ff0000') }
                },
                {
                  label: 'blue',
                  click: () => { setColorForEnt('vertices', '#00ff00') }
                },
                {
                  label: 'green',
                  click: () => { setColorForEnt('vertices', '#0000ff') }
                },
              ]
            },
            {
              label: 'edges',
              submenu: [
                {
                label: 'red',
                click: () => { setColorForEnt('edges', '#ff0000') }
                },
                {
                  label: 'blue',
                  click: () => { setColorForEnt('edges', '#00ff00') }
                },
                {
                  label: 'green',
                  click: () => { setColorForEnt('edges', '#0000ff') }
                },
              ]
            },
            {
              label: 'faces',
              submenu: [
                {
                  label: 'red',
                  click: () => { setColorForEnt('faces', '#ff0000') }
                  },
                  {
                    label: 'blue',
                    click: () => { setColorForEnt('faces', '#00ff00') }
                  },
                  {
                    label: 'green',
                    click: () => { setColorForEnt('faces', '#0000ff') }
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
//TODO: change this so that it actually does something
function setColorForEnt(type, color) {
  console.log(`${type} ${color}`);
  switch (type) {
    case 'vertices':
      
      break;
    case 'edges':
      
      break;
    case 'faces':
      
      break;
  }
} 