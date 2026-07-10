import { useMutation, useQueries } from "@tanstack/react-query";
import { useAppStore, useRepoStore } from "../state/repo-store";
import {
  getDiffNumstat,
  getStatus,
  stageFile,
  unstageFile,
} from "../api/git-api";

export function useChanges(repoPath) {
  console.log("useChanges repoPath", repoPath);

  const stagingMutation = useMutation({
    mutationFn: (args) => {
      return stageFile(args.repoPath, args.filePath);
    },
    onSuccess: () => {
      console.log("Staged file/s, refreshing status");
      useAppStore.getState().triggerRefresh(); // Could use tanstacks own query invalidation as well, need to have a think
    },
    onError: (e) => {
      console.error("Couldnt stage file/s", e.message);
    },
  });

  const restoringMutation = useMutation({
    mutationFn: (args) => {
      return unstageFile(args.repoPath, args.filePath);
    },
    onSuccess: () => {
      console.log("Restored file/s, refreshing status");
      useAppStore.getState().triggerRefresh();
    },
    onError: () => {
      console.error("Couldnt stage file/s");
    },
  });

  const result = useQueries({
    queries: [
      {
        queryKey: ["status", repoPath],
        queryFn: () => {
          return getStatus(repoPath);
        },
      },
      {
        queryKey: ["numstat", repoPath],
        queryFn: () => {
          return getDiffNumstat(repoPath);
        },
      },
    ],
    combine: ([status, numstat]) => {
      const statusFiles = status.data ?? [];
      const numstatFiles = numstat.data ?? [];

      const numstatMap = new Map(
        numstatFiles.map((file) => [file.filePath, file]),
      );

      const files = statusFiles.map((statusFile) => {
        const stats = numstatMap.get(statusFile.path);

        return {
          ...statusFile,

          additions: stats?.additions ?? 0,
          deletions: stats?.deletions ?? 0,
          filePath: stats?.filePath ?? statusFile.path,
        };
      });

      return {
        files,

        isLoading: status.isPending || numstat.isPending,

        error: status.error ?? numstat.error,
      };
    },
  });

  return {
    result,
    stagingMutation,
    restoringMutation,
  };
}
