import { registerRepoIPC } from "./git-ipc/repo.ipc";
import { registerGitStagingIPC } from "./git-ipc/staging.ipc";

export function registerGitIPC() {
  registerGitStagingIPC();
  registerRepoIPC();
}
