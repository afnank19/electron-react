import { runGit } from "./git-runner";

export async function commit(repoPath, message) {
  try {
    const output = await gitCommit(repoPath, message);

    return {
      success: true,
      operation: "commit",
      commitMessage: message,
      message: "Successfully created a new commit.",
      gitOutput: output.trim(),
    };
  } catch (e) {
    return {
      success: false,
      operation: "commit",
      commitMessage: message,
      message: "Failed to create a commit.",
      error: err.message,
    };
  }
}

export async function gitCommit(repoPath, message) {
  return runGit(repoPath, ["commit", "-m", message], { raw: true });
}
