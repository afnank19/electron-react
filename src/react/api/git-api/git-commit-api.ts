import { parseGitCommitOutput } from "../../utils/git-utils";

// TODO: type error on window needs to be fixed
export async function getCommits(repoPath: string) {
  const res = await window.gitAPI.commits(repoPath);
  // parse commits based on a format
  const parsedCommits = parseGitCommitOutput(res);
  return parsedCommits;
}
