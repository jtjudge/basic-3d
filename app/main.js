const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;

// Set environment
process.env.NODE_ENV = "development";

let mainWindow;

app.on("ready", function() {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "main.html"),
		protocol: "file:",
		slashes: true
	}));
});