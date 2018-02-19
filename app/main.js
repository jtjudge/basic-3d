const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow} = electron;

// Set environment
process.env.NODE_ENV = "development";

let mainWindow;

app.on("ready", function() {
  mainWindow = new BrowserWindow({height: 700, width: 830, minHeight: 700, minWidth: 830});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "main.html"),
    protocol: "file:",
    slashes: true
  }));
});
