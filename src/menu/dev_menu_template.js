import { app } from "electron";
import { BrowserWindow } from "electron";
const fs = require('fs');

export default {
  label: "Development",
  submenu: [
    {
      label: "Toggle DevTools",
      accelerator: "Shift+CmdOrCtrl+I",
      click: () => {
        BrowserWindow.getFocusedWindow().toggleDevTools();
      }
    }, {
      label: "Nuke Config",
      accelerator: "Shift+CmdOrCtrl+D",
      click: () => {
        let path = app.getPath("userData") + "/config.json";
        fs.unlink(path, () => {});
        app.relaunch()
        app.exit()
      }
    }
  ]
};
