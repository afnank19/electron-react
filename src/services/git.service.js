import { exec } from "child_process";

export function getRepoRoot(path) {
  return new Promise((resolve, reject) => {
    exec("git rev-parse --show-toplevel", { cwd: path }, (err, stdout, stderr) => {
      if (err) return reject("Not a git repository");
      resolve(stdout.trim());
    });
  });
}

export function gitStatus(repoPath) {
  console.log("status for repo path: ", repoPath)
  return execGitRaw(repoPath, "status --porcelain");
}

export function gitUserLocalEmail(repoPath) {
  return execGit(repoPath, "config user.email")
}

export function stageFile(repoPath, filePath) {
  return execGit(repoPath, "add "+filePath)
}

export function restoreFileFromStaging(repoPath, filePath) {
  return execGit(repoPath, "restore --staged " + filePath)
}

export function gitBranchLocal(repoPath) {
  return execGit(repoPath, "branch --format='%(refname:short)'")
}

export function gitSwitchToBranch(repoPath, branch) {
  return execGit(repoPath, "switch " + branch);
}

export function gitCreateAndSwitchToBranch(repoPath, branchname) {
  return execGit(repoPath, "switch -c" + branchname);
}

export function gitGetActiveBranch(repoPath) {
  return execGit(repoPath, "branch --show-current")
}

export function getCommits(repoPath) {
  return execGit(repoPath, `log --pretty=format:"%h %cr %an %s"`)
}

export function commitChanges(repoPath, message) {
  console.log("commiting with message", message)
  return execGit(repoPath, `commit -m "` + message + `"`)
}

export function getFileDiff(repoPath, filePath) {
  return execGitRaw(repoPath, "diff " + filePath)
}

// helper
function execGit(cwd, args) {
  return new Promise((resolve, reject) => {
    exec(`git ${args}`, { cwd }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout.trim());
    });
  });
}

// Not trimming the output, helpful for parsing, may remove the upper function if its not needed
function execGitRaw(cwd, args) {
  return new Promise((resolve, reject) => {
    exec(`git -c color.ui=always ${args}`, { cwd }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}
