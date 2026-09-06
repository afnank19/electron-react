import { parseGitStatusPorcelain, parseNumstat } from "../utils/utils";

export async function getDiffNumstat(repoPath) {
  const res = await window.gitAPI.diffNumstat(repoPath);
  const parsedNumstat = parseNumstat(res); // ??
  return parsedNumstat;
}

export async function getStatus(repoPath) {
  const res = await window.gitAPI.status(repoPath);
  const parsedStatus = parseGitStatusPorcelain(res);
  return parsedStatus;
}

export async function stageFile(repoPath, filePaths) {
  await window.gitAPI.stageFile(repoPath, filePaths);
}

export async function unstageFile(repoPath, filePaths) {
  await window.gitAPI.restoreStagedFile(repoPath, filePaths);
}

export async function getAheadBehindCount(repoPath) {
  const res = await window.gitAPI.aheadBehindCount(repoPath);
  const parsedCount = res.split("\t");
  return parsedCount;
}
