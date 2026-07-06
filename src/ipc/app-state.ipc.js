import { ipcMain } from "electron";
import { appState } from "../main/app-state";

export function registerAppStateIPC() {
  ipcMain.handle("app:setRepoPath", (_, repoPath) => {
    appState.setRepoPath(repoPath);
  })

  ipcMain.handle("app:getRepoPath", (_) => {
    appState.getRepoPath();
  })
}
