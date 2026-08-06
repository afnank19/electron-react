import { ipcMain } from "electron/main";
import { gitConfigUserEmail, gitStatus } from "../../services/git/repo-inspection";
import { GIT_IPC_CHANNELS } from "./channels";

export function registerRepoIPC() {
  ipcMain.handle(GIT_IPC_CHANNELS.status, (_, repoPath) => {
    return gitStatus(repoPath);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.userEmail, (_, repoPath) => {
    return gitConfigUserEmail(repoPath);
  });
}
