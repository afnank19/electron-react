import { ipcMain } from "electron";
import { GIT_IPC_CHANNELS } from "./channels";
import { gitAddFiles, gitRestoreFiles, gitRestoreStagedFiles } from "../../services/git/staging";

// Filepaths is an array of strings
export function registerGitStagingIPC() {
  ipcMain.handle(GIT_IPC_CHANNELS.stageFile, (_, repoPath, filePaths) => {
    return gitAddFiles(repoPath, filePaths);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.restoreStagedFile, (_, repoPath, filePaths) => {
    return gitRestoreStagedFiles(repoPath, filePaths);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.restoreFile, (_, repoPath, filePaths) => {
    return gitRestoreFiles(repoPath, filePaths);
  });
}
