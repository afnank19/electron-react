import { ipcMain } from "electron/main";
import { gitConfigUserEmail, gitLog, gitStatus } from "../../services/git/repo-inspection";
import { GIT_IPC_CHANNELS } from "./channels";
import { appState } from "../../main/app-state";

export function registerRepoIPC() {
  ipcMain.handle(GIT_IPC_CHANNELS.status, (_, repoPath) => {
    return gitStatus(repoPath);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.userEmail, (_, repoPath) => {
    return gitConfigUserEmail(repoPath);
  });

  // Debugging with the app state path here
  // if this breaks, path are not synced
  ipcMain.handle(GIT_IPC_CHANNELS.commits, (_, repoPath) => {
    const electronPath = appState.getRepoPath();
    console.log("repo path", repoPath);
    console.log("elec path", electronPath);
    return gitLog(electronPath, null);
  });
}
