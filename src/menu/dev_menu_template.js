import { BrowserWindow } from "electron";

export default {
  label: "Development",
  submenu: [
    {
      label: "Toggle DevTools",
      accelerator: "Shift+CmdOrCtrl+I",
      click: () => {
        BrowserWindow.getFocusedWindow().toggleDevTools();
      }
    }
  ]
};
