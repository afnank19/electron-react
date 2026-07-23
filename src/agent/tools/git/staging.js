import { appState } from "../../../main/app-state";
import { stageAll, stageFiles, unstageFiles } from "../../../services/git/staging";

export const stageFilesTool = {
  name: "stage_files",
  definition: {
    type: "function",
    function: {
      name: "stage_files",
      description: "Stage specific files.",
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

    return await stageFiles(cwd, files);
  },
};

export const stageAllTool = {
  name: "stage_all_files",
  definition: {
    type: "function",
    function: {
      name: "stage_all_files",
      description: "Stage all updated/untracked files using git add .",
    },
  },

  async execute(args) {
    const cwd = appState.getRepoPath();

    return await stageAll(cwd);
  },
};

export const unstageFilesTool = {
  name: "unstage_files",
  definition: {
    type: "function",
    function: {
      name: "unstage_files",
      description: "Unstage specific staged files.",
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

    return await unstageFiles(cwd, files);
  },
};
