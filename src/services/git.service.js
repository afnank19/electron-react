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
  return execGitRaw(repoPath, "status --porcelain");
}

export function gitUserLocalEmail(repoPath) {
  return execGit(repoPath, "config user.email")
}

export function stageFile(repoPath, filePath) {
  return execGit(repoPath, "add "+filePath)
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
    exec(`git ${args}`, { cwd }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}
