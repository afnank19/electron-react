import { runGit } from "./git-runner";

// Agentic Use

export async function switchBranch(repoPath, branchName) {
  try {
    const output = await gitSwitchBranch(repoPath, branchName);

    return {
      success: true,
      message: "Switched to branch successfully",
      gitOutput: output,
    };
  } catch (e) {
    return {
      success: false,
      message: "Could not switch branch.",
      error: e.message,
    };
  }
}

export async function createAndSwitchBranch(repoPath, branchName) {
  try {
    const output = await gitCreateBranch(repoPath, branchName);

    return {
      success: true,
      message: "Created and switched to new branch",
      gitOutput: output,
    };
  } catch (e) {
    return {
      success: false,
      message: "Could not create branch.",
      error: e.message,
    };
  }
}

export async function getActiveBranch(repoPath) {
  try {
    const output = await gitBranchShowCurrent(repoPath);
    return {
      success: true,
      message: "Here is the current branch",
      gitOutput: output,
    };
  } catch (e) {
    return {
      success: false,
      message: "Could not get current branch",
      error: e.message,
    };
  }
}

export async function getLocalBranches(repoPath) {
  try {
    const output = await gitLocalBranches(repoPath);
    return {
      success: true,
      message: "Here is a list of local branches",
      gitOutput: output,
    };
  } catch (e) {
    return {
      success: false,
      message: "Could not get local branches",
      error: e.message,
    };
  }
}

// Primitives

export async function gitSwitchBranch(repoPath, branchName) {
  return runGit(repoPath, ["switch", branchName]);
}

// this creates and switches at the same time
export async function gitCreateBranch(repoPath, branchName) {
  return runGit(repoPath, ["switch", "-c", branchName]);
}

export async function gitBranchShowCurrent(repoPath) {
  return runGit(repoPath, ["branch", "--show-current"], { raw: false, color: false });
}

export async function gitLocalBranches(repoPath) {
  return runGit(repoPath, ["branch", "--format=%(refname:short)"], {
    raw: false,
  });
}

export async function gitRemoteBranches(repoPath) {
  return runGit(repoPath, ["branch", "-r", "--format=%(refname:short)"], {
    raw: false,
  });
}

// If this throws, then the branch has no upstream set up.
export async function gitCheckBranchUpstream(repoPath) {
  return runGit(repoPath, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
}

// TODO
export async function deleteBranch(repoPath) {}
