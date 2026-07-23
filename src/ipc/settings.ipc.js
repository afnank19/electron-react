import { ipcMain } from "electron";
import { getSettings, setSettings } from "../services/settings.service";

export function registerSettingsIPC() {
  ipcMain.handle("cfg:getSettings", (_) => {
    return getSettings();
  });

  ipcMain.handle("cfg:setSettings", (_, newSettings) => {
    console.log("new settings", newSettings);
    return setSettings(newSettings);
  });
}
