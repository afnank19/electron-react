import { useEffect } from "react";
import { useRepoStore } from "../state/repo-store";
import { useChatStore, type ChatItem } from "../state/chat-store";
import { useQueryInvalidation } from "../queries/use-query-invalidation";

const READ_ONLY_TOOLS = new Set([
  "get_git_status",
  "get_diffs",
  "get_diff_numstat",
  "get_remotes",
  "get_current_branch",
  "list_local_branches",
]);

const STATUS_TOOLS = new Set(["stage_files", "stage_all_files", "unstage_files"]);

const COMMIT_TOOLS = new Set(["commit"]);

export function useAgentEvents() {
  const repoPath = useRepoStore((s) => s.repoPath);
  const addItem = useChatStore((s) => s.addItem);
  const { invalidateAll, invalidateStatus, invalidateCommits } = useQueryInvalidation();

  useEffect(() => {
    if (!repoPath) return;

    const unsubscribe = window.agentEvents.subscribe((event: ChatItem) => {
      if (event.type === "tool_complete") {
        handleToolComplete(
          event.tool,
          repoPath,
          invalidateAll,
          invalidateStatus,
          invalidateCommits,
        );
        return;
      }
      addItem(event);
    });

    return unsubscribe;
  }, [repoPath, invalidateAll, invalidateStatus, invalidateCommits, addItem]);
}

function handleToolComplete(
  tool: string | undefined,
  repoPath: string,
  invalidateAll: (repoPath: string) => void,
  invalidateStatus: (repoPath: string) => void,
  invalidateCommits: (repoPath: string) => void,
) {
  if (!tool || READ_ONLY_TOOLS.has(tool)) return;

  if (STATUS_TOOLS.has(tool)) {
    invalidateStatus(repoPath);
  } else if (COMMIT_TOOLS.has(tool)) {
    invalidateCommits(repoPath);
    invalidateStatus(repoPath);
  } else {
    invalidateAll(repoPath);
  }
}
