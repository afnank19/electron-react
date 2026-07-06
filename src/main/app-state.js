let repoPath = null;

export const appState = {
  getRepoPath: () => repoPath,
  setRepoPath: (newPath) => { repoPath = newPath }
}
