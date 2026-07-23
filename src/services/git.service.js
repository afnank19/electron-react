// Problems in this file
// - The git functions are too specific especially the diff ones
// - different git runners

import { exec } from "child_process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export function getRepoRoot(path) {
  return new Promise((resolve, reject) => {
    exec("git rev-parse --show-toplevel", { cwd: path }, (err, stdout, stderr) => {
      if (err) return reject("Not a git repository");
      resolve(stdout.trim());
    });
  });
}

export function gitStatus(repoPath) {
  console.log("status for repo path: ", repoPath);
  return execGitRaw(repoPath, "status --porcelain -uall");
}

export function gitUserLocalEmail(repoPath) {
  return execGit(repoPath, "config user.email");
}

export function stageFile(repoPath, filePath) {
  return execGit(repoPath, "add " + filePath);
}

export function restoreFileFromStaging(repoPath, filePath) {
  return execGit(repoPath, "restore --staged " + filePath);
}

export function gitBranchLocal(repoPath) {
  return execGit(repoPath, "branch --format='%(refname:short)'");
}

export function gitSwitchToBranch(repoPath, branch) {
  return execGitWithOutput(repoPath, "switch " + branch);
}

export function gitCreateAndSwitchToBranch(repoPath, branchname) {
  return execGitWithOutput(repoPath, "switch -c " + branchname);
}

export function gitGetActiveBranch(repoPath) {
  return execGit(repoPath, "branch --show-current");
}

export function getCommits(repoPath) {
  return execGitWithOutput(repoPath, `log --pretty=format:"%h %cr %an %s"`);
}

export function commitChanges(repoPath, message) {
  console.log("commiting with message", message);
  return execGitWithOutput(repoPath, `commit -m "` + message + `"`);
}

export function getHeadDiff(repoPath) {
  return execGitWithOutput(repoPath, "diff HEAD");
}

export function getFileDiff(repoPath, filePath) {
  // return execGitRaw(repoPath, "diff HEAD -- " + filePath);
  return runGit(repoPath, ["diff", "HEAD", "--", filePath], { raw: true, color: false });
}

export function getCommitLog(repoPath, commitHash) {
  console.log("Getting show for hash", commitHash);
  return runGit(repoPath, ["show", commitHash], { raw: true, color: true });
}

export function getRemotes(repoPath) {
  return execGitWithOutput(repoPath, "remote");
}

export function gitDiffStat(repoPath) {
  return execGitWithOutput(repoPath, "diff --stat");
}

export function gitDiffNumStat(repoPath) {
  return execGitWithOutput(repoPath, "diff --numstat");
}

export function getFileDiffNoANSIIColor(repoPath, filePaths) {
  return runGit(repoPath, ["diff", "HEAD", "--", ...filePaths], { raw: true, color: false });
}

export function pushToRemote(repoPath, remote) {
  let activeBranch = "";
  gitBranchLocal(repoPath).then((out) => {
    activeBranch = out;
  });
  console.log("pushing to remote branch", activeBranch);

  // git push -u <remote> <active-branch>
  return execGitWithOutput(repoPath, "push -u " + remote + " " + activeBranch);
}

export function pullFromRemote(repoPath, remote) {
  let activeBranch = "";
  gitBranchLocal(repoPath).then((out) => {
    activeBranch = out;
  });
  console.log("pulling from remote branch", remote, activeBranch);

  // git pull <remote> <active-branch>
  return execGitWithOutput(repoPath, "pull " + remote + " " + activeBranch);
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

// this function returns all output that git throws
function execGitWithOutput(cwd, args) {
  return new Promise((resolve, reject) => {
    exec(`git ${args}`, { cwd }, (err, stdout, stderr) => {
      const output = [stdout, stderr].filter(Boolean).join("").trim();

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

// This is a better approach, which i'll integrate soon, after testing it separately
const execFileAsync = promisify(execFile);

async function runGit(cwd, args, { raw = false, color = false } = {}) {
  // Enable forced ANSII color for viewer
  if (color) {
    args = ["-c", "color.ui=always", ...args];
  }

  try {
    const { stdout, stderr } = await execFileAsync("git", args, { cwd });
    const output = `${stdout}${stderr}`;
    return raw ? stdout : output.trim();
  } catch (err) {
    const output = `${err.stdout || ""}${err.stderr || ""}`.trim();
    throw new Error(output || err.message);
  }
}
