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
