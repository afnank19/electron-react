import { appState } from "../../../main/app-state";
import {
  createAndSwitchBranch,
  getActiveBranch,
  getLocalBranches,
  switchBranch,
} from "../../../services/git/branching";

export const switchBranchTool = {
  name: "switch_branch",
  definition: {
    type: "function",
    function: {
      name: "switch_branch",
      description: "Switch to an existing branch.",
      parameters: {
        type: "object",
        properties: {
          branchName: { type: "string" },
        },
        required: ["branchName"],
      },
    },
  },

  async execute({ branchName }) {
    const cwd = appState.getRepoPath();

    return await switchBranch(cwd, branchName);
  },
};

export const createBranchTool = {
  name: "create_and_switch_branch",
  definition: {
    type: "function",
    function: {
      name: "create_and_switch_branch",
      description: "Create and switch to a new branch",
      parameters: {
        type: "object",
        properties: {
          branchName: { type: "string" },
        },
        required: ["branchName"],
      },
    },
  },

  async execute({ branchName }) {
    const cwd = appState.getRepoPath();

    return await createAndSwitchBranch(cwd, branchName);
  },
};


export const listLocalBranchesTool = {
  name: "list_local_branches",
  definition: {
    type: "function",
    function: {
      name: "list_local_branches",
      description: "List the local branches of the repository",
    },
  },

  async execute(args) {
    const cwd = appState.getRepoPath();

    return await getLocalBranches(cwd);
  }
}

export const getCurrentBranchTool = {
  name: "get_current_branch",
  definition: {
    type: "function",
    function: {
      name: "get_current_branch",
      description: "Get the current checked out branch",
    },
  },

  async execute(args) {
    const cwd = appState.getRepoPath();

  return await getActiveBranch(cwd);
  }
}
