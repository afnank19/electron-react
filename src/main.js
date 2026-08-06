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
