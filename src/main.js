// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu, ipcMain, shell, Notification } from "electron";
import appMenuTemplate from "./menu/app_menu_template";
import settingsMenuTemplate from "./menu/settings_menu_template";
import devMenuTemplate from "./menu/dev_menu_template";
import createWindow from "./helpers/window";
const fs = require('fs');
const cron = require('node-cron');

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');
app.commandLine.appendSwitch('max-active-webgl-contexts=16');

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

if (process.platform === 'win32')
{
    app.setAppUserModelId(app.name);
}

const setApplicationMenu = () => {
  const menus = [appMenuTemplate, settingsMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  menus.push(devMenuTemplate);

  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// We can communicate with our window (the renderer process) via messages.
const initIpc = () => {
  ipcMain.on("need-app-path", (event, arg) => {
    event.reply("app-path", app.getAppPath());
  });
  ipcMain.on("open-external-link", (event, href) => {
    shell.openExternal(href);
  });
};

function getConfig() {
  let path = app.getPath("userData") + "/config.json";
  let rawdata = '{"url":"http://example.com","autorefresh":"-1"}';
  try {
    rawdata = fs.readFileSync(path);
  } catch {

  }
  let data = JSON.parse(rawdata);
  let appurl = {};
  if (data.url === "http://example.com") {
    appurl.name = __dirname + "/no-url.html";
    appurl.protocol = "file:";
  } else {
    appurl.name = data.url.replace("http://", "");
    appurl.protocol = "http:";
  }
  return { "url": appurl, "autorefresh": data.autorefresh, "grid": data.grid };
}

app.on("ready", () => {
  setApplicationMenu();
  initIpc();

  let config = getConfig();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      // Two properties below are here for demo purposes, and are
      // security hazard. Make sure you know what you're doing
      // in your production app.
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      nodeIntegration: false,
      // Spectron needs access to remote module
      enableRemoteModule: env.name === "test"
    }
  });

  if (config.autorefresh != -1) {
    cron.schedule(config.autorefresh, () => {
      console.log("reloading...")
      mainWindow.webContents.reloadIgnoringCache();
    });
  }

  if (config.grid != "-1" && config.grid != undefined) {
    mainWindow.loadURL(
      url.format({
        // pathname: path.join(__dirname, "app.html"),
        pathname: config.url.name + "/grids/" + config.grid,
        protocol: config.url.protocol,
        slashes: true,
        query: {
          "cl":"cvpc"
        }
      })
    );
  } else {
    mainWindow.loadURL(
      url.format({
        // pathname: path.join(__dirname, "app.html"),
        pathname: config.url.name,
        protocol: config.url.protocol,
        slashes: true,
        query: {
          "cl":"cvpc"
        }
      })
    );
  }

  mainWindow.webContents.on("did-fail-load", function() {
    new Notification({
      title: "Error!",
      body: "Unable to connect to CamViewerPlus Server. Please double-check your instance URL.",
    }).show();
    mainWindow.loadURL(
      url.format({
        // pathname: path.join(__dirname, "app.html"),
        pathname: __dirname + "/error.html",
        protocol: "file:",
        slashes: true
      })
    );
  });

  // if (env.name === "development") {
  //   mainWindow.openDevTools();
  // }
});

app.on("window-all-closed", () => {
  app.quit();
});
