import { registerGitBranchingIPC } from "./git-ipc/branching.ipc";
import { registerGitCommitsIPC } from "./git-ipc/commits.ipc";
import { registerGitDiffIPC } from "./git-ipc/diff.ipc";
import { registerGitRepoIPC } from "./git-ipc/repo.ipc";
import { registerGitRemoteIPC } from "./git-ipc/remote.ipc";
import { registerGitStagingIPC } from "./git-ipc/staging.ipc";

export function registerGitIPC() {
  registerGitStagingIPC();
  registerGitRepoIPC();
  registerGitBranchingIPC();
  registerGitCommitsIPC();
  registerGitRemoteIPC();
  registerGitDiffIPC();
}
