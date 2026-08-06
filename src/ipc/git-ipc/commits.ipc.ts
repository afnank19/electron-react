import { ipcMain } from "electron/main";
import { commitChanges } from "../../services/git.service";
import { GIT_IPC_CHANNELS } from "./channels";

export function registerGitCommitsIPC() {
  ipcMain.handle(GIT_IPC_CHANNELS.commitChange, (_, repoPath, message) => {
    return commitChanges(repoPath, message);
  });
}
