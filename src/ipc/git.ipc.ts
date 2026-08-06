import { registerGitBranchingIPC } from "./git-ipc/branching.ipc";
import { registerGitCommitsIPC } from "./git-ipc/commits.ipc";
import { registerGitRemoteIPC } from "./git-ipc/remote.ipc";
import { registerRepoIPC } from "./git-ipc/repo.ipc";
import { registerGitStagingIPC } from "./git-ipc/staging.ipc";

export function registerGitIPC() {
  registerGitStagingIPC();
  registerRepoIPC();
  registerGitBranchingIPC();
  registerGitCommitsIPC();
  registerGitRemoteIPC();
}
