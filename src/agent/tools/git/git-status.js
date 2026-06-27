import { appState } from "../../../main/app-state";
import { gitStatus } from "../../../services/git.service";

export const gitStatusTool = {
  name: "get_git_status",
  definition: {
    type: "function",
    function: {
      name: "get_git_status",
      description: "Get git status --porcelain for the current repository",
    },
  },

  async execute(args) {
    const cwd = appState.getRepoPath();
    return await gitStatus(cwd);
  }
}
