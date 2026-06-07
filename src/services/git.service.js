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
  return execGitWithOutput(repoPath, "switch " + branch);
}

export function gitCreateAndSwitchToBranch(repoPath, branchname) {
  return execGitWithOutput(repoPath, "switch -c" + branchname);
}

export function gitGetActiveBranch(repoPath) {
  return execGit(repoPath, "branch --show-current")
}

export function getCommits(repoPath) {
  return execGitWithOutput(repoPath, `log --pretty=format:"%h %cr %an %s"`)
}

export function commitChanges(repoPath, message) {
  console.log("commiting with message", message)
  return execGitWithOutput(repoPath, `commit -m "` + message + `"`)
}

export function getFileDiff(repoPath, filePath) {
  return execGitRaw(repoPath, "diff " + filePath)
}

export function getRemotes(repoPath) {
  return execGitWithOutput(repoPath, "remote")
}

// export function pushToRemote(repoPath) {
//   return execGitWithOutput(repoPath, "push -u ")
// }

// helper
function execGit(cwd, args) {
  return new Promise((resolve, reject) => {
    exec(`git ${args}`, { cwd }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout.trim());
    });
  });
}

// this function returns all output that git throws
function execGitWithOutput(cwd, args) {
  return new Promise((resolve, reject) => {
    exec(`git ${args}`, { cwd }, (err, stdout, stderr) => {
      const output = [stdout, stderr]
        .filter(Boolean)
        .join("")
        .trim();

      if (err) {
        reject(output || err.message);
        return;
      }

      resolve(output);
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
