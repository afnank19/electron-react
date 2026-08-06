import { ipcMain } from "electron";
import {
  generateCommitMessageV2,
  handleAgentRequest,
  summarizeCurrentChanges,
} from "../../services/llm.service";
import { LLM_IPC_CHANNELS } from "./channels";

export function registerLLMIPC() {
  ipcMain.handle(LLM_IPC_CHANNELS.commitMsg, (_) => {
    return generateCommitMessageV2();
  });

  ipcMain.handle(LLM_IPC_CHANNELS.diffSummary, (_, repoPath) => {
    return summarizeCurrentChanges();
  });

  ipcMain.handle(LLM_IPC_CHANNELS.agentRequest, (_, request, ctx) => {
    return handleAgentRequest(request, ctx);
  });
}
