// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("gitAPI", {
  status: (repoPath) => ipcRenderer.invoke("git:status", repoPath),
  userEmail: (repoPath) => ipcRenderer.invoke("git:userEmail", repoPath),
  branches: (repoPath) => ipcRenderer.invoke("git:branches", repoPath),
  commits: (repoPath) => ipcRenderer.invoke("git:commits", repoPath),
  checkout: (repoPath, branch) =>
    ipcRenderer.invoke("git:checkout", { repoPath, branch }),
  push: (repoPath) => ipcRenderer.invoke("git:push", repoPath)
});

contextBridge.exposeInMainWorld("repoAPI", {
  openRepo: () => ipcRenderer.invoke("repo:openDialog")
});