import { appState } from "../../../main/app-state";
import { getRemotes, pullFromRemote, pushToRemote } from "../../../services/git/remote";

export const pushToRemoteTool = {
  name: "push_to_remote",
  definition: {
    type: "function",
    function: {
      name: "push_to_remote",
      description: "Push current changes to remote, automatically sets upstream as well if there is none.",
      parameters: {
        type: "object",
        properties: {
          remote: { type: "string" },
        },
        required: ["remote"],
      },
    },
  },

  async execute({ remote } : { remote: string}) {
    const cwd = appState.getRepoPath();

    return await pushToRemote(cwd, remote);
  },
};

export const pullFromRemoteTool = {
  name: "pull_from_remote",
  definition: {
    type: "function",
    function: {
      name: "pull_from_remote",
      description: "Pull from a specified remote.",
      parameters: {
        type: "object",
        properties: {
          remote: { type: "string" },
        },
        required: ["remote"],
      },
    },
  },

  async execute({ remote } : { remote: string}) {
    const cwd = appState.getRepoPath();

    return await pullFromRemote(cwd, remote);
  },
};

export const getRemotesTool = {
  name: "get_remotes",
  definition: {
    type: "function",
    function: {
      name: "get_remotes",
      description: "Get a list of all remotes for the current repository",
    },
  },

  async execute(args: any) {
    const cwd = appState.getRepoPath();

    return await getRemotes(cwd);
  },
};
