import { ipcMain } from "electron/main";
import { commitChanges } from "../../services/git.service";
import { getCommitLog, gitLog } from "../../services/git/repo-inspection";
import { appState } from "../../main/app-state";
import { GIT_IPC_CHANNELS } from "./channels";

export function registerGitCommitsIPC() {
  ipcMain.handle(GIT_IPC_CHANNELS.commitChange, (_, repoPath, message) => {
    return commitChanges(repoPath, message);
  });

  // Debugging with the app state path here
  // if this breaks, path are not synced
  ipcMain.handle(GIT_IPC_CHANNELS.commits, (_, repoPath) => {
    const electronPath = appState.getRepoPath();
    return gitLog(electronPath, null);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.getCommitLog, (_, repoPath, commitHash) => {
    return getCommitLog(repoPath, commitHash);
  });
}
