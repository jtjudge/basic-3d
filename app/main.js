const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, ipcMain} = electron;
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
  var prefMenu = { label: "Preferences", submenu: [] };

  fileMenu.submenu.push({
    label: "Quit", 
    click: function() { app.quit(); }
  });

  editMenu.submenu.push({
    label: "Undo",
    click: function() {
      mainWindow.webContents.send("run", {
        name: "Undo", data: {}
      }); 
    }
  });

  editMenu.submenu.push({
    label: "Redo",
    click: function() {
      mainWindow.webContents.send("run", {
        name: "Redo", data: {}
      }); 
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

  var keyPrefs = {
    label: "Key Bindings", 
    click: function() { 
      mainWindow.webContents.send("run", {
        name: "KeyBindingsMenu", data: {}
      }); 
    }
  };

  var colorPrefs = {
    label: "Change Default Colors",
    submenu: []
  };

  colorPrefs.submenu.push({
    label: "Vertices",
    submenu: getColorChanges("VERTEX")
  });

  colorPrefs.submenu.push({
    label: "Edges",
    submenu: getColorChanges("EDGE")
  });

  colorPrefs.submenu.push({
    label: "Faces",
    submenu: getColorChanges("FACE")
  });

  prefMenu.submenu.push(keyPrefs);
  prefMenu.submenu.push(colorPrefs);

  function changeColor(change) {
    mainWindow.webContents.send("run", {
      name: "ColorChange", data: change });
  }

  function getColorChanges(name) {
    var items = [];
    items.push({
      label: "Red", click: function() {
        changeColor({ name: name, color: 0xff0000 });
      }
    });
    items.push({
      label: "Green", click: function() {
        changeColor({ name: name, color: 0x00ff00 });
      }
    });
    items.push({
      label: "Blue", click: function() {
        changeColor({ name: name, color: 0x0000ff });
      }
    });
    return items;
  }

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([ fileMenu, editMenu, viewMenu, prefMenu ])
  );

});