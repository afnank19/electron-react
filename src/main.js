import { app, BrowserWindow } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { exec, spawn } from "node:child_process";
import { registerSettingsIPC } from "./ipc/settings.ipc.js";
import { registerAppStateIPC } from "./ipc/app-state.ipc.js";
import { initializeToolRegistry } from "./agent/tools/registry.js";
import { initializeAgent } from "./agent/agent.js";
import { eventBus } from "./events/eventBus.js";
import { initializeEventForwarder } from "./events/eventForwader.js";
import { registerGitIPC } from "./ipc/git.ipc.js";
import { registerLLMIPC } from "./ipc/llm.ipc.js";
import { registerRepoIPC } from "./ipc/repo.ipc.js";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Module-scoped reference so the second-instance handler can reach it
let mainWindow;

// --- Single instance lock: must run before anything else that touches the window/app state ---
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // Someone tried to run a second instance — focus our existing window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  const createWindow = () => {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
  };

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

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
