import { useMutation } from "@tanstack/react-query";
import { useAppStore, useRepoStore } from "../state/repo-store";
import { stageFile, unstageFile } from "../api/git-api";

export function useChanges() {
  const stagingMutation = useMutation({
    mutationFn: (args) => {
      return stageFile(args.repoPath, args.filePath);
    },
    onSuccess: () => {
      console.log("Staged file/s, refreshing status");
      useAppStore.getState().triggerRefresh(); // Could use tanstacks own query invalidation as well, need to have a think
    },
    onError: (e) => {
      console.error("Couldnt stage file/s", e.message)
    }
  })

  const restoringMutation = useMutation({
    mutationFn: (args) => {
      return unstageFile(args.repoPath, args.filePath);
    },
    onSuccess: () => {
      console.log("Restored file/s, refreshing status");
      useAppStore.getState().triggerRefresh();
    },
    onError: () => {
      console.error("Couldnt stage file/s")
    }
  })

  return {
    stagingMutation,
    restoringMutation
  }
}
