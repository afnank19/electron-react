import { appState } from "../../../main/app-state";
import { gitStatus } from "../../../services/git.service";

export const gitStatusTool = {
  name: "get_git_status",
  definition: {
    type: "function",
    function: {
      name: "get_git_status",
      description: "Get git status --porcelain -uall for the current repository. It results in the complete filepaths of all the files",
    },
  },

  async execute(args) {
    const cwd = appState.getRepoPath();
    return await gitStatus(cwd);
  }
}
