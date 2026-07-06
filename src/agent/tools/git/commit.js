import { appState } from "../../../main/app-state";
import { commit } from "../../../services/git/commit";

export const commitTool = {
  name: "commit",
  definition: {
    type: "function",
    function: {
      name: "commit",
      description: "Commit all staged files.",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
        required: ["message"],
      },
    },
  },

  async execute({ message }) {
    const cwd = appState.getRepoPath();

    return await commit(cwd, message);
  },
};
