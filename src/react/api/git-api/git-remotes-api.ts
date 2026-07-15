import { splitByNewLine } from "../../utils/utils";

export async function getRemotes(repoPath: string): Promise<string[]> {
  const res: string = await window.gitAPI.getRemotes(repoPath);
  return splitByNewLine(res);
}

export async function pushToRemote(repoPath: string, remote: string): Promise<string> {
  return window.gitAPI.push(repoPath, remote);
}

export async function pullFromRemote(repoPath: string, remote: string): Promise<string> {
  return window.gitAPI.pull(repoPath, remote);
}
