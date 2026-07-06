import { parseNumstat } from "../utils/utils";

export async function getDiffNumstat(repoPath) {
  const res = await window.gitAPI.diffNumstat(repoPath);
  parseNumstat(res);
  return res;
}
