import { runGit } from "./git-runner";

// Agent use funcs
export async function stageFiles(repoPath, filePaths) {
  try {
    await runGit(repoPath, ["add", ...filePaths], { raw: true });

    return {
      success: true,
      message: `Successfully staged ${filePaths.length} file(s).`,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to stage the requested files.",
      error: err.message,
    };
  }
}

export async function stageAll(repoPath) {
  try {
    await runGit(repoPath, ["add", "."], { raw: true });

    return {
      success: true,
      message: "Successfully staged all modified, new, and deleted files.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to stage all files.",
      error: err.message,
    };
  }
}

export async function unstageFiles(repoPath, filePaths) {
  try {
    await runGit(repoPath, ["restore", "--staged", ...filePaths]);

    return {
      success: true,
      message: `Successfully unstaged ${filePaths.length} file(s).`,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to unstage the requested files.",
      error: err.message,
    };
  }
}

export async function gitAddFiles(repoPath, filePaths) {
  return runGit(repoPath, ["add", ...filePaths], { raw: true });
}

export async function gitAddAllFiles(repoPath) {
  return runGit(repoPath, "add", ".", { raw: true });
}

export async function gitRestoreFiles(repoPath, filePaths) {
  return runGit(repoPath, ["restore", "--staged", ...filePaths]);
}
