import { app } from "electron";
import { BrowserWindow } from "electron";
const prompt = require('electron-prompt');
const fs = require('fs');

export default {
  label: "App",
  submenu: [
    {
      label: "Set Instance URL",
      accelerator: "CmdOrCtrl+I",
      click: () => {
        openPrompt();
      }
    }, {
      label: "Quit",
      accelerator: "CmdOrCtrl+Q",
      click: () => {
        app.quit();
      }
    },
    {
      label: "Reload",
      accelerator: "CmdOrCtrl+R",
      click: () => {
        BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
      }
    }
  ]
};


function openPrompt() {
  let path = app.getPath("userData") + "/config.json";
  let rawdata = '{"url":"http://example.com"}';
  try {
    rawdata = fs.readFileSync(path);
  } catch {

  }
  let data = JSON.parse(rawdata);
  prompt({
    title: 'Set Instance URL',
    label: 'URL:',
    value: data.url,
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