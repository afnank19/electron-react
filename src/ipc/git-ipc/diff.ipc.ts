import { ipcMain } from "electron/main";
import { getFileDiff, getHeadDiff, gitDiffStat } from "../../services/git.service";
import { gitDiffNumstat } from "../../services/git/repo-inspection";
import { GIT_IPC_CHANNELS } from "./channels";

export function registerGitDiffIPC() {
  ipcMain.handle(GIT_IPC_CHANNELS.showFileDiff, (_, repoPath, filePath) => {
    return getFileDiff(repoPath, filePath);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.headDiff, (_, repoPath) => {
    return getHeadDiff(repoPath);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.diffStat, (_, repoPath) => {
    return gitDiffStat(repoPath);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.diffNumstat, (_, repoPath) => {
    return gitDiffNumstat(repoPath);
  });
}
