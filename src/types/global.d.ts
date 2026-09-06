import type { ChatItem } from "../react/state/chat-store";

interface GitAPI {
  status(repoPath: string): Promise<string>;
  userEmail(repoPath: string): Promise<string>;
  stageFile(repoPath: string, filePaths: string[]): Promise<string>;
  restoreStagedFile(repoPath: string, filePaths: string[]): Promise<string>;
  branches(repoPath: string): Promise<string>;
  remoteBranches(repoPath: string): Promise<string>;
  switchBranch(repoPath: string, branch: string): Promise<string>;
  createBranch(repoPath: string, branch: string): Promise<string>;
  branch(repoPath: string): Promise<string>;
  commits(repoPath: string): Promise<string>;
  commitChange(repoPath: string, message: string): Promise<string>;
  showFileDiff(repoPath: string, filePath: string): Promise<string>;
  getCommitLog(repoPath: string, commitHash: string): Promise<string>;
  getRemotes(repoPath: string): Promise<string>;
  addRemote(repoPath: string, remote: string, url: string): Promise<string>;
  push(repoPath: string, remote: string): Promise<string>;
  pull(repoPath: string, remote: string): Promise<string>;
  fetch(repoPath: string, remote: string): Promise<string>;
  getHeadDiff(repoPath: string): Promise<string>;
  diffStat(repoPath: string): Promise<string>;
  diffNumstat(repoPath: string): Promise<string>;
  aheadBehindCount(repoPath: string): Promise<string>;
}

interface AppAPI {
  getRepoPath(): Promise<string | null>;
  setRepoPath(repoPath: string | null): Promise<void>;
}

interface RepoAPI {
  openRepo(): Promise<string | null | { error: string }>;
}

interface AIAPI {
  commitMsg(): Promise<string>;
  diffSummary(repoPath: string): Promise<string>;
  agentRequest(request: string, ctx: ChatItem[]): Promise<string>;
}

interface AgentEventsAPI {
  subscribe(callback: (event: ChatItem) => void): () => void;
}

interface GitSageSettings {
  apiKey: string;
  baseURL: string;
}

interface SettingsAPI {
  getSettings(): Promise<GitSageSettings>;
  setSettings(settings: GitSageSettings): Promise<void>;
}

declare global {
  interface Window {
    gitAPI: GitAPI;
    app: AppAPI;
    repoAPI: RepoAPI;
    ai: AIAPI;
    agentEvents: AgentEventsAPI;
    settings: SettingsAPI;
  }
}

export {};
