import { BrowserWindow, dialog, ipcMain } from "electron";
import { getRepoRoot } from "../../services/git.service";
import { appState } from "../../main/app-state";
import { REPO_IPC_CHANNELS } from "./channels";

export function registerRepoIPC() {
  ipcMain.handle(REPO_IPC_CHANNELS.openDialog, async () => {
    const win = BrowserWindow.getFocusedWindow();

    const options: Electron.OpenDialogOptions = {
      properties: ["openDirectory"],
    };

    const result = win
      ? await dialog.showOpenDialog(win, options)
      : await dialog.showOpenDialog(options);

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
