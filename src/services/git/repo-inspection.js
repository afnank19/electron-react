import { appState } from "../../main/app-state";
import { runGit } from "./git-runner";

// Intended as a function for the LLM to use as a tool
// for other uses, pls look into smaller primitive functions below or elsewhere
// Function will return the complete status of the repository
export async function getRepoStatus() {
  const cwd = appState.getRepoPath();

  let repoState = "";

  try {
    const statusResult = await gitStatus(cwd);
  } catch (e) {
    throw new Error(e.message);
  }

  try {
    const currentBranch = await getCurrentBranch(cwd);
  } catch (e) {
    throw new Error(e.message);
  }
}

// Primitive functions
export async function gitStatus(repoPath) {
  return runGit(repoPath, ["status", "--porcelain", "-uall"], { raw: true });
}

export async function getCurrentBranch(repoPath) {
  return runGit(repoPath, ["branch", "--show-current"], { raw: true });
}

// Gets the commits
export function gitLog(repoPath, limit) {
  let args = ["log", `--pretty=format:%h %cr %an %s`];

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

export function getCommitLog(repoPath, commitHash) {
  return runGit(repoPath, ["show", commitHash], { raw: true, color: true });
}
