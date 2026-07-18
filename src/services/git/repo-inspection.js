import { appState } from "../../main/app-state";
import { gitBranchShowCurrent } from "./branching";
import { runGit } from "./git-runner";

// Intended as a function for the LLM to use as a tool
// for other uses, pls look into smaller primitive functions below or elsewhere
// Function will return the complete status of the repository
export async function getRepoStatus() {
  const cwd = appState.getRepoPath();

  let repoState = "Here is the git status --porcelain result \n";

  try {
    const statusResult = await gitStatus(cwd);
    repoState += statusResult + "\n";
  } catch (e) {
    throw new Error(e.message);
  }

  try {
    const currentBranch = await gitBranchShowCurrent(cwd);
    repoState += "Current branch is " + currentBranch;
  } catch (e) {
    throw new Error(e.message);
  }

  return {
    success: true,
    message: "Operation succeeded",
    output: repoState,
  };
}

// Primitive functions
export async function gitStatus(repoPath) {
  return runGit(repoPath, ["status", "--porcelain", "-uall"], { raw: true });
}

// export async function getCurrentBranch(repoPath) {
//   return runGit(repoPath, ["branch", "--show-current"], { raw: true });
// }

// Gets the commits
export function gitLog(repoPath, limit) {
  let args = ["log", `--pretty=format:%h%x1f%cr%x1f%an%x1f%s%x1e`];

  if (limit != null) {
    args = [...args, "-n", limit];
  }

  return runGit(repoPath, args, { raw: true });
}

export async function getLocalBranches(repoPath) {
  return runGit(repoPath, ["branch", "--format=%(refname:short)"], {
    raw: false,
  });
}

export async function getDiff(staged) {}

// Placing this function here because it is repo inspection but
// i havent decided how the diff function is going to look like,
// so temporarily it is here
export async function gitDiffNumstat(repoPath) {
  return runGit(repoPath, ["diff", "--numstat"]);
}

export function getCommitLog(repoPath, commitHash) {
  return runGit(repoPath, ["show", commitHash], { raw: true, color: false });
}
