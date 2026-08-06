import { ipcMain } from "electron/main";
import { getRemotes } from "../../services/git.service";
import { gitFetch, gitPull, gitPush, gitRemoteAdd } from "../../services/git/remote";
import { GIT_IPC_CHANNELS } from "./channels";

export function registerGitRemoteIPC() {
  ipcMain.handle(GIT_IPC_CHANNELS.getRemotes, (_, repoPath) => {
    return getRemotes(repoPath);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.addRemote, (_, repoPath, remote, url) => {
    return gitRemoteAdd(repoPath, remote, url);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.push, (_, repoPath, remote) => {
    return gitPush(repoPath, remote);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.pull, (_, repoPath, remote) => {
    return gitPull(repoPath, remote);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.fetch, (_, repoPath, remote) => {
    return gitFetch(repoPath, remote);
  });
}
