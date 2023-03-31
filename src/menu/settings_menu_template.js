import { app } from "electron";
import { BrowserWindow } from "electron";
const prompt = require('electron-prompt');
const fs = require('fs');


const promptCss = __dirname + "/prompt.css";

export default {
  label: "Configuration",
  submenu: [
    {
      label: "Set Instance URL",
      accelerator: "CmdOrCtrl+I",
      click: () => {
        openInstancePrompt();
      }
    }, {
      label: "Set Auto-Refresh Delay",
      accelerator: "CmdOrCtrl+D",
      click: () => {
        openAutoRefreshPrompt();
      }
    }, {
      label: "Open Settings",
      accelerator: "CmdOrCtrl+S",
      click: () => {
        openSettings();
      }
    }
  ]
};


function openInstancePrompt() {
  let path = app.getPath("userData") + "/config.json";
  let rawdata = '{"url":"http://example.com","autorefresh":"-1"}';
  try {
    rawdata = fs.readFileSync(path);
  } catch {

  }
  let data = JSON.parse(rawdata);
  prompt({
    title: 'Set Instance URL',
    label: 'Instance URL:',
    value: data.url,
    customStylesheet: promptCss,
    height: 175,
    inputAttrs: {
      type: 'url'
    },
    type: 'input'
  })
    .then((r) => {
      if (r === null) {
        console.log('user cancelled');
      } else {
        data.url = r;
        fs.writeFileSync(path, JSON.stringify(data));
        app.relaunch()
        app.exit()
      }
    })
    .catch(console.error);
}

function openAutoRefreshPrompt() {
  let path = app.getPath("userData") + "/config.json";
  let rawdata = '{"url":"http://example.com","autorefresh":"-1"}';
  try {
    rawdata = fs.readFileSync(path);
  } catch {

  }
  let data = JSON.parse(rawdata);
  prompt({
    title: 'Set Auto-Refresh Delay',
    label: 'Auto-Refresh Delay:',
    customStylesheet: promptCss,
    height: 175,
    value: data.autorefresh,
    type: 'select',
    selectOptions: {"-1":"Disabled","* * * * *":"1 minute","*/15 * * * *":"15 minutes","0 * * * *":"1 hour","0 */4 * * *":"4 hours","0 */8 * * *":"8 hours"}
  })
    .then((r) => {
      if (r === null) {
        console.log('user cancelled');
      } else {
        data.autorefresh = r;
        fs.writeFileSync(path, JSON.stringify(data));
        app.relaunch()
        app.exit()
      }
    })
    .catch(console.error);
}

function openSettings() {
  BrowserWindow.getFocusedWindow().webContents.executeJavaScript('$("#settings").show();0');
}