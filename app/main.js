const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, ipcMain } = electron;
const Menu = electron.Menu;

process.env.NODE_ENV = "development";

var mainWindow;

app.on("ready", function () {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "main.html"),
    protocol: "file:",
    slashes: true
  }));
  var fileMenu = { label: "File", submenu: [] };
  var editMenu = { label: "Edit", submenu: [] };
  var viewMenu = { label: "View", submenu: [] };
  fileMenu.submenu.push({
    label: "Quit", 
    click: function() { app.quit(); }
  });
  editMenu.submenu.push({
    label: "Key Bindings", 
    click: function() { 
      mainWindow.webContents.send("run", "KeyBindingsMenu"); 
    }
  });
  viewMenu.submenu.push({
    label: "Dev Tools", 
    click: function() { mainWindow.toggleDevTools(); }
  });
  viewMenu.submenu.push({
    label: "Reload", 
    click: function() { mainWindow.reload(); }
  });
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([ fileMenu, editMenu, viewMenu ])
  );
});