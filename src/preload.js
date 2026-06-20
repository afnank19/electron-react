// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("gitAPI", {
  status: (repoPath) => ipcRenderer.invoke("git:status", repoPath),
  userEmail: (repoPath) => ipcRenderer.invoke("git:userEmail", repoPath),
  stageFile: (repoPath, filePath) => ipcRenderer.invoke("git:stageFile", repoPath, filePath),
  restoreFile: (repoPath, filePath) => ipcRenderer.invoke("git:restoreFile", repoPath, filePath),
  branches: (repoPath) => ipcRenderer.invoke("git:branches", repoPath),
  switchBranch: (repoPath, branch) => ipcRenderer.invoke("git:switchBranch", repoPath, branch),
  createBranch: (repoPath, branch) => ipcRenderer.invoke("git:createBranch", repoPath, branch),
  branch: (repoPath) => ipcRenderer.invoke("git:branch", repoPath),
  commits: (repoPath) => ipcRenderer.invoke("git:commits", repoPath),
  commitChange: (repoPath, message) => ipcRenderer.invoke("git:commitChange", repoPath, message),
  showFileDiff: (repoPath, filePath) => ipcRenderer.invoke("git:showFileDiff", repoPath, filePath),
  getCommitLog: (repoPath, commitHash) => ipcRenderer.invoke("git:getCommitLog", repoPath, commitHash),
  checkout: (repoPath, branch) =>
    ipcRenderer.invoke("git:checkout", { repoPath, branch }),
  getRemotes: (repoPath) => ipcRenderer.invoke("git:getRemotes", repoPath),
  push: (repoPath, remote) => ipcRenderer.invoke("git:push", repoPath, remote),
  pull: (repoPath, remote) => ipcRenderer.invoke("git:pull", repoPath, remote),
  getHeadDiff: (repoPath) => ipcRenderer.invoke("git:headDiff", repoPath),
  diffStat: (repoPath) => ipcRenderer.invoke("git:diffStat", repoPath),
});

contextBridge.exposeInMainWorld("repoAPI", {
  openRepo: () => ipcRenderer.invoke("repo:openDialog")
});

contextBridge.exposeInMainWorld("ai", {
  commitMsg: (diff) => ipcRenderer.invoke("llm:commitMsg", diff),
  diffSummary: (repoPath) => ipcRenderer.invoke("llm:diffSummary", repoPath),
})

contextBridge.exposeInMainWorld("settings", {
  getSettings: () => ipcRenderer.invoke("cfg:getSettings"),
  setSettings: (settings) => ipcRenderer.invoke("cfg:setSettings", settings)
})
