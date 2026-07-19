import { gitBranchShowCurrent, gitCheckBranchUpstream } from "./branching";
import { runGit } from "./git-runner";

// Agent functions

export async function pushToRemote(cwd: string, remote: string) {
  try {
    const output = await gitPush(cwd, remote);

    return {
      success: true,
      message: "The push tool ran successfully",
      gitOutput: output
    }
  } catch (e) {
    return {
      success: false,
      message: "The push tool failed",
      error: getErrorMessage(e)
    }
  }
}

export async function pullFromRemote(cwd: string, remote: string) {
  try {
    const output = await gitPull(cwd, remote);

    return {
      success: true,
      message: "The pull tool ran successfully.",
      gitOutput: output
    }
  } catch (e) {
    return {
      success: false,
      message: "The pull tool failed",
      error: getErrorMessage(e)
    }
  }
}

export async function getRemotes(cwd: string) {
  try {
    const output = await gitRemote(cwd);

    return {
      success: true,
      message: "Here is a list of the remotes",
      gitOutput: output
    }
  } catch (e) {
    return {
      success: false,
      message: "Unable to get remotes.",
      error: getErrorMessage(e)
    }
  }
}



// Primitives

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

export async function gitRemoteAdd(cwd: string, remote: string, url: string) {
  return runGit(cwd, ["remote", "add", remote, url], { raw: true, color: false});
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
