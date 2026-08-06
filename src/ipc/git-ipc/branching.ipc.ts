import { ipcMain } from "electron/main";
import {
  gitBranchShowCurrent,
  gitCreateBranch,
  gitLocalBranches,
  gitRemoteBranches,
  gitSwitchBranch,
} from "../../services/git/branching";
import { GIT_IPC_CHANNELS } from "./channels";

export function registerGitBranchingIPC() {
  ipcMain.handle(GIT_IPC_CHANNELS.branches, (_, repoPath) => {
    return gitLocalBranches(repoPath);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.switchBranch, (_, repoPath, branchName) => {
    return gitSwitchBranch(repoPath, branchName);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.createBranch, (_, repoPath, branchName) => {
    return gitCreateBranch(repoPath, branchName);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.branch, (_, repoPath) => {
    return gitBranchShowCurrent(repoPath);
  });

  ipcMain.handle(GIT_IPC_CHANNELS.remoteBranches, (_, repoPath) => {
    return gitRemoteBranches(repoPath);
  });
}
