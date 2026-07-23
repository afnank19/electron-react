import { BrowserWindow } from "electron";
import { eventBus } from "./eventBus";

export function initializeEventForwarder() {
  eventBus.on("agent:event", (event) => {
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send("agent:event", event);
    }
  });
}
