import { appState } from "../../../main/app-state";
import { gitDiffNumStat } from "../../../services/git.service";

export const gitDiffNumStatTool = {
  name: "get_diff_numstat",
  definition: {
    type: "function",
    function: {
      name: "get_diff_numstat",
      description: "Get git diff --numstat for the entire repository.",
    },
  },

  async execute(args) {
    const cwd = appState.getRepoPath();

    return await gitDiffNumStat(cwd);
  }
}
