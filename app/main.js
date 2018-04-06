const electron = require("electron");
const url = require("url");
const path = require("path");
const fs = require('fs'); 

const { app, BrowserWindow, ipcMain, Menu, dialog } = electron;

var mainWindow;

process.env.NODE_ENV = "development";

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

  var saveClick = function () {
    dialog.showSaveDialog(function (filename) {
      run("SaveFile", { name: filename });
    });
  };

  var loadClick = function () {
    dialog.showOpenDialog(function (filenames) {
      run("LoadFile", { name: filenames[0] });
    });
  };

  var file = (function () {
    var menu = {
      label: "File",
      submenu: []
    };
    menu.submenu.push({
      label: "Save",
      click: saveClick
    });
    menu.submenu.push({
      label: "Load",
      click: loadClick
    });
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
      label: "Cut",
      click: function () {
        run("Cut");
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