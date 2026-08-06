import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { exec, spawn } from "node:child_process";
import { getRepoRoot } from "./services/git.service";
import {
  diffSummaryAgent,
  generateCommitMessage,
  generateCommitMessageV2,
  handleAgentRequest,
  summarizeCurrentChanges,
} from "./services/llm.service.js";
import { registerSettingsIPC } from "./ipc/settings.ipc.js";
import { appState } from "./main/app-state.js";
import { registerAppStateIPC } from "./ipc/app-state.ipc.js";
import { initializeToolRegistry } from "./agent/tools/registry.js";
import { initializeAgent } from "./agent/agent.js";
import { eventBus } from "./events/eventBus.js";
import { initializeEventForwarder } from "./events/eventForwader.js";
import { registerGitIPC } from "./ipc/git.ipc.js";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  registerAppStateIPC();
  registerRepoIPC();
  registerGitIPC();
  registerLLMIPC();
  registerSettingsIPC();
  initializeToolRegistry();
  initializeAgent();
  initializeEventForwarder();
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

export function registerRepoIPC() {
  ipcMain.handle("repo:openDialog", async (event) => {
    const win = BrowserWindow.getFocusedWindow();

    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });

    if (result.canceled) return null;

    let repoPath = result.filePaths[0];
    try {
      const repoRoot = await getRepoRoot(repoPath);
      appState.setRepoPath(repoRoot);
      return repoRoot;
    } catch {
      return { error: "Selected folder is not inside a git repo" };
    }
  });
}

export function registerLLMIPC() {
  ipcMain.handle("llm:commitMsg", (_) => {
    return generateCommitMessageV2();
  });

  ipcMain.handle("llm:diffSummary", (_, repoPath) => {
    // return diffSummaryAgent(repoPath);
    return summarizeCurrentChanges();
  });

  ipcMain.handle("llm:agentRequest", (_, request, ctx) => {
    return handleAgentRequest(request, ctx);
  });
}
