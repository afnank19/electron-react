export const queryKeyStore = {
  status: (repoPath) => ["status", repoPath],
  numstat: (repoPath) => ["numstat", repoPath],
  commit: (repoPath) => ["commits", repoPath],
  branch: (repoPath) => ["branches", repoPath],
  activeBranch: (repoPath) => ["activeBranch", repoPath],
};
