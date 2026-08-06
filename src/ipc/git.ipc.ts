import { registerGitStagingIPC } from "./git-ipc/staging.ipc";

export function registerGitIPC() {
  registerGitStagingIPC();
}
