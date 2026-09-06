// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
  getRepoPath: () => ipcRenderer.invoke("app:getRepoPath"),
  setRepoPath: (repoPath) => ipcRenderer.invoke("app:setRepoPath", repoPath),
});

contextBridge.exposeInMainWorld("gitAPI", {
  status: (repoPath) => ipcRenderer.invoke("git:status", repoPath),
  userEmail: (repoPath) => ipcRenderer.invoke("git:userEmail", repoPath),
  stageFile: (repoPath, filePaths) => ipcRenderer.invoke("git:stageFile", repoPath, filePaths),
  restoreStagedFile: (repoPath, filePaths) => ipcRenderer.invoke("git:restoreStagedFile", repoPath, filePaths),
  branches: (repoPath) => ipcRenderer.invoke("git:branches", repoPath),
  remoteBranches: (repoPath) => ipcRenderer.invoke("git:remoteBranches", repoPath),
  switchBranch: (repoPath, branch) => ipcRenderer.invoke("git:switchBranch", repoPath, branch),
  createBranch: (repoPath, branch) => ipcRenderer.invoke("git:createBranch", repoPath, branch),
  branch: (repoPath) => ipcRenderer.invoke("git:branch", repoPath),
  commits: (repoPath) => ipcRenderer.invoke("git:commits", repoPath),
  commitChange: (repoPath, message) => ipcRenderer.invoke("git:commitChange", repoPath, message),
  showFileDiff: (repoPath, filePath) => ipcRenderer.invoke("git:showFileDiff", repoPath, filePath),
  getCommitLog: (repoPath, commitHash) =>
    ipcRenderer.invoke("git:getCommitLog", repoPath, commitHash),
  getRemotes: (repoPath) => ipcRenderer.invoke("git:getRemotes", repoPath),
  addRemote: (repoPath, remote, url) => ipcRenderer.invoke("git:addRemote", repoPath, remote, url),
  push: (repoPath, remote) => ipcRenderer.invoke("git:push", repoPath, remote),
  pull: (repoPath, remote) => ipcRenderer.invoke("git:pull", repoPath, remote),
  fetch: (repoPath, remote) => ipcRenderer.invoke("git:fetch", repoPath, remote),
  getHeadDiff: (repoPath) => ipcRenderer.invoke("git:headDiff", repoPath),
  diffStat: (repoPath) => ipcRenderer.invoke("git:diffStat", repoPath),
  diffNumstat: (repoPath) => ipcRenderer.invoke("git:diffNumstat", repoPath),
  aheadBehindCount: (repoPath) => ipcRenderer.invoke("git:ABCount", repoPath)
});

contextBridge.exposeInMainWorld("repoAPI", {
  openRepo: () => ipcRenderer.invoke("repo:openDialog"),
});

contextBridge.exposeInMainWorld("ai", {
  commitMsg: () => ipcRenderer.invoke("llm:commitMsg"),
  diffSummary: (repoPath) => ipcRenderer.invoke("llm:diffSummary", repoPath),
  agentRequest: (request, ctx) => ipcRenderer.invoke("llm:agentRequest", request, ctx),
});

contextBridge.exposeInMainWorld("agentEvents", {
  subscribe(callback) {
    const listener = (_, event) => callback(event);

    ipcRenderer.on("agent:event", listener);

    return () => {
      ipcRenderer.removeListener("agent:event", listener);
    };
  },
});

contextBridge.exposeInMainWorld("settings", {
  getSettings: () => ipcRenderer.invoke("cfg:getSettings"),
  setSettings: (settings) => ipcRenderer.invoke("cfg:setSettings", settings),
});
