import { splitByNewLine } from "../../utils/utils";

export async function getLocalBranches(repoPath: string) {
  const res = await window.gitAPI.branches(repoPath);
  const parsedBranches = splitByNewLine(res);
  console.log("local branches", parsedBranches);
  return parsedBranches;
}

export async function getActiveBranch(repoPath: string): Promise<string> {
  const res: string = await window.gitAPI.branch(repoPath);
  console.log("active branch", res);
  return res;
}

export async function switchBranch(repoPath: string, branch: string): Promise<string> {
  const res: string = await window.gitAPI.switchBranch(repoPath, branch);
  return res;
}

export async function getRemoteBranches(repoPath: string) {
  const res = await window.gitAPI.remoteBranches(repoPath);
  const parsed = splitByNewLine(res);
  return parsed
    .filter((b) => !b.includes("HEAD") && b.includes("/"))
    .map((b) => b.replace(/^[^\/]+\//, ""));
}

export async function createAndSwitchToBranch(repoPath: string, branch: string): Promise<string> {
  const res: string = await window.gitAPI.createBranch(repoPath, branch);
  return res;
}
