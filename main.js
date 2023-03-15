"use strict";

// Import parts of electron to use
require("@electron/remote/main").initialize();
const Sentry = require("@sentry/electron");
Sentry.init({
  dsn: "https://f10f2a0b0cb94dc6bfb819be6171641a@sentry.hamravesh.com/91",
});

const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require("electron");
const path = require("path");
const url = require("url");
const axios = require("axios");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-http-cache");

require("update-electron-app")();

if (require("electron-squirrel-startup"))
  setTimeout(() => {
    app.quit();
  }, 1000);

if (handleSquirrelEvent()) {
  process.exit();
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let workerWindow;
let notifWindow;
let tray;
let isQuiting;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
    }
  });

  app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, "assets", "icon.ico"));
    tray.setIgnoreDoubleClickEvents(true);
    tray.on("click", function (e) {
      mainWindow.show();
    });
    tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: "خروج",
          click: function () {
            isQuiting = true;
            app.quit();
          },
        },
      ])
    );
    createWindow();
  });
}

app.on("before-quit", function () {
  isQuiting = true;
});

// Keep a reference for dev mode
let dev = false;

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  dev = true;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

function createWindow() {
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  if (!dev) {
    mainWindow.maximize();
    mainWindow.setMenu(null);
  } // and load the index.html of the app.
  let indexPath;

  if (dev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }
  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open the DevTools automatically if developing
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require("electron-devtools-installer");

    installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
      console.log("Error loading React DevTools: ", err)
    );
    if (dev) {
      mainWindow.webContents.openDevTools();
      workerWindow.webContents.openDevTools();
    }
  });
  // Emitted when the window is closed.
  mainWindow.on("close", function (event) {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (!isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      event.returnValue = false;
    }
  });
  mainWindow.on("closed", function (event) {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    workerWindow = null;
    notifWindow = null;
    app.quit();
  });

  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  workerWindow.loadURL("file://" + __dirname + "/assets/printerWindow.html");
  notifWindow = new BrowserWindow({
    width: 240,
    height: 135,
    show: false,
    transparent: true,
    frame: false,
    focusable: false,
    x: width - 250,
    y: height - 195,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  notifWindow.loadURL("file://" + __dirname + "/assets/notification.html");
  notifWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  notifWindow.setAlwaysOnTop(true, "floating", 1);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
ipcMain.on("print", (event, content, url, printOptions) => {
  workerWindow.webContents.send("print", content, url, printOptions);
  ipcMain.once("printFinished", () => {
    event.returnValue = "result";
  });
});
ipcMain.on("orderReceived", (event, order) => {
  notifWindow.webContents.send("orderReceived", order);
  notifWindow.moveTop();
  notifWindow.show();
});
ipcMain.on("hideNotification", () => {
  notifWindow.hide();
});

ipcMain.on("redirectOrder", async (event, order) => {
  if (order) {
    await mainWindow.webContents.executeJavaScript(`localStorage.setItem("selectedSiteDomain", "${order.siteDomain}")`);
    mainWindow.webContents.send("redirectOrder", order);
  }
});
ipcMain.handle("request", async (_, axios_request, headers) => {
  axios.defaults.headers = headers;
  const result = await axios(axios_request).catch((error) => {
    return { data: error?.response?.data };
  });
  return { data: result?.data, status: result?.status };
});

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require("child_process");
  const path = require("path");

  const appFolder = path.resolve(process.execPath, "..");
  const rootAtomFolder = path.resolve(appFolder, "..");
  const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) {
      console.warn(error);
    }

    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(["--createShortcut", exeName]);

      setTimeout(() => {
        app.quit();
      }, 1000);
      break;

    case "--squirrel-uninstall":
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(["--removeShortcut", exeName]);

      setTimeout(() => {
        app.quit();
      }, 1000);
      break;

    case "--squirrel-obsolete":
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      setTimeout(() => {
        app.quit();
      }, 1000);
      break;
  }
}
