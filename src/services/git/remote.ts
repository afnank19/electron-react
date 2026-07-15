import { gitBranchShowCurrent, gitCheckBranchUpstream } from "./branching";
import { runGit } from "./git-runner";

export async function gitRemote(cwd: string) {
  return runGit(cwd, ["remote"]);
}

export async function gitPush(cwd: string, remote: string) {
  let activeBranch = "";
  try {
    activeBranch = await gitBranchShowCurrent(cwd);
  } catch (e) {
    throw new Error(`Failed while getting current branch: ${getErrorMessage(e)}`);
  }

  return runGit(cwd, ["push", "-u", remote, activeBranch], { raw: true, color: false });
}

export async function gitPull(cwd: string, remote = "origin") {
  const branch = (await gitBranchShowCurrent(cwd)).trim();

  if (!branch) {
    throw new Error("Cannot pull while HEAD is detached.");
  }

  try {
    await gitCheckBranchUpstream(cwd);

    return runGit(cwd, ["pull"], {
      raw: true,
      color: false,
    });
  } catch {
    return runGit(cwd, ["pull", remote, branch], {
      raw: true,
      color: false,
    });
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
