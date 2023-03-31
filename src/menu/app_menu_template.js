import { app } from "electron";
import { BrowserWindow } from "electron";
const openAboutWindow = require('about-window').default;


const aboutCss = __dirname + "/about.css";
const aboutIcon = __dirname + "/about.png";


export default {
  label: "App",
  submenu: [
    {
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
    },
    {
      label: "About",
      accelerator: "CmdOrCtrl+A",
      click: () =>
      openAboutWindow({icon_path:aboutIcon,homepage:"https://github.com/Fanman03/CamViewerPlus-Client",css_path:aboutCss})
    }
  ]
};