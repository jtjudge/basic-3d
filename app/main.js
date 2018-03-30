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

  var run = function (name, data) {
    if (data === undefined) data = {};
    mainWindow.webContents.send("run", {
      name: name, data: data
    });
  };

  var file = (function () {
    var menu = {
      label: "File",
      submenu: []
    };
    menu.submenu.push({
      label: "Quit",
      click: function () {
        app.quit();
      }
    });
    return menu;
  })();

  var edit = (function () {
    var menu = {
      label: "Edit",
      submenu: []
    };
    menu.submenu.push({
      label: "Copy",
      click: function () {
        run("Copy");
      }
    });
    menu.submenu.push({
      label: "Paste",
      click: function () {
        run("Paste");
      }
    });
    menu.submenu.push({
      label: "Undo",
      click: function () {
        run("Undo");
      }
    });
    menu.submenu.push({
      label: "Redo",
      click: function () {
        run("Redo");
      }
    });
    return menu;
  })();

  var view = (function () {
    var menu = {
      label: "View",
      submenu: []
    };
    menu.submenu.push({
      label: "Dev Tools",
      click: function () {
        mainWindow.toggleDevTools();
      }
    });
    menu.submenu.push({
      label: "Reload",
      click: function () {
        mainWindow.reload();
      }
    });
    return menu;
  })();

  var prefs = (function () {
    var menu = {
      label: "Preferences",
      submenu: []
    };
    menu.submenu.push({
      label: "Key Bindings",
      click: function () {
        run("BindingsMenu");
      }
    });
    menu.submenu.push({
      label: "Toggle Axis Helper",
      click: function () {
        run("ToggleAxisHelper");
      }
    });
    menu.submenu.push({
      label: "Invert Orbit Controls",
      click: function () {
        run("InvertOrbit");
      }
    });
    menu.submenu.push({
      label: "Change Colors",
      click: function () {
        run("ColorsMenu");
      }
    });
    menu.submenu.push({
      label: "Change Brush Size",
      click: function () {
        run("ToggleBigBrush");
      }
    });
    menu.submenu.push({
      label: "Tips Formatting",
      click: function () {
        run("ToggleTipsList");
      }
    });
    return menu;
  })();

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([file, edit, view, prefs])
  );

});