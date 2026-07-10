import { parseGitStatusPorcelain, parseNumstat } from "../utils/utils";

export async function getDiffNumstat(repoPath) {
  const res = await window.gitAPI.diffNumstat(repoPath);
  parseNumstat(res); // ??
  return res;
}

export async function getStatus(repoPath) {
  const res = await window.gitAPI.status(repoPath);
  const parsedStatus = parseGitStatusPorcelain(res);
  return parsedStatus;
}

export async function stageFile(repoPath, filePath) {
  await window.gitAPI.stageFile(repoPath, filePath);
}

export async function unstageFile(repoPath, filePath) {
  await window.gitAPI.restoreFile(repoPath, filePath);
}
