import { appState } from "../../../main/app-state";
import { getFileDiffNoANSIIColor } from "../../../services/git.service";

export const gitDiffTool = {
  name: "get_diffs",
  definition: {
    type: "function",
    function: {
      name: "get_diffs",
      description: "Get git diff for specific files...",
      parameters: {
        type: "object",
        properties: {
          files: { type: "array", items: { type: "string" } },
        },
        required: ["files"],
      },
    },
  },

  async execute({ files }) {
    const cwd = appState.getRepoPath();
    console.log("running diff for files", files);

    return await getFileDiffNoANSIIColor(cwd, files);
  },
};
