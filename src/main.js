import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import * as git from "./services/git.service.js";
import { exec, spawn } from 'node:child_process';
import { getRepoRoot } from './services/git.service';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  registerRepoIPC();
  registerGitIPC();
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

export function registerGitIPC() {
  ipcMain.handle("git:status", (_, repoPath) => {
    return git.gitStatus(repoPath);
  });

  ipcMain.handle("git:userEmail", (_, repoPath) => {
    return git.gitUserLocalEmail(repoPath);
  })

  ipcMain.handle("git:stageFile", (_, repoPath, filePath) => {
    return git.stageFile(repoPath, filePath);
  })

  ipcMain.handle("git:restoreFile", (_, repoPath, filePath) => {
    return git.restoreFileFromStaging(repoPath, filePath);
  })

  // Returns all branches
  ipcMain.handle("git:branches", (_, repoPath) => {
    return git.gitBranchLocal(repoPath);
  });

  ipcMain.handle("git:switchBranch", (_, repoPath, branch) => {
    return git.gitSwitchToBranch(repoPath, branch);
  });

  ipcMain.handle("git:createBranch", (_, repoPath, branch) => {
    return git.gitCreateAndSwitchToBranch(repoPath, branch);
  });

  ipcMain.handle("git:branch", (_, repoPath) => {
    return git.gitGetActiveBranch(repoPath);
  } )

  ipcMain.handle("git:commits", (_, repoPath) => {
    return git.getCommits(repoPath);
  });

  ipcMain.handle("git:commitChange", (_, repoPath, message) => {
    return git.commitChanges(repoPath, message);
  });

  ipcMain.handle("git:showFileDiff", (_, repoPath, filePath) => {
    return git.getFileDiff(repoPath, filePath);
  });

  ipcMain.handle("git:getCommitLog", (_, repoPath, commitHash) => {
    return git.getCommitLog(repoPath, commitHash);
  });

  ipcMain.handle("git:checkout", (_, { repoPath, branch }) => {
    return git.gitCheckout(repoPath, branch);
  });

  ipcMain.handle("git:getRemotes", (_, repoPath) => {
    return git.getRemotes(repoPath);
  });

  ipcMain.handle("git:push", (_, repoPath) => {
    return git.gitPush(repoPath);
  });
}

export function registerRepoIPC() {
  ipcMain.handle("repo:openDialog", async (event) => {
    const win = BrowserWindow.getFocusedWindow();

    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"]
    });

    if (result.canceled) return null;

    let repoPath = result.filePaths[0];
    try {
      const repoRoot = await getRepoRoot(repoPath);
      return repoRoot;
    } catch {
      return { error: "Selected folder is not inside a git repo" };
    }
  });
}
