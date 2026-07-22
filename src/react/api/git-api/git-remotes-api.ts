import { splitByNewLine } from "../../utils/utils";

export async function getRemotes(repoPath: string): Promise<string[]> {
  const res: string = await window.gitAPI.getRemotes(repoPath);
  // return splitByNewLine(res);
  return res
    .split("\n")
    .map(r => r.trim())
    .filter(Boolean);
}

export async function pushToRemote(repoPath: string, remote: string): Promise<string> {
  return window.gitAPI.push(repoPath, remote);
}

export async function pullFromRemote(repoPath: string, remote: string): Promise<string> {
  return window.gitAPI.pull(repoPath, remote);
}

export async function fetchFromRemote(repoPath: string, remote: string): Promise<string> {
  return window.gitAPI.fetch(repoPath, remote);
}

export async function addRemote(repoPath: string, remote: string, url: string): Promise<string> {
  console.log("REMOTE API REMOTE ADD",remote, url)
  const output: string = await window.gitAPI.addRemote(repoPath, remote, url);
  return output
}
