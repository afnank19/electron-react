// Not triggering a refresh on mutations here because staging doesn't really affect other parts
// of the app

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAheadBehindCount, getDiffNumstat, getStatus, stageFile, unstageFile } from "../api/git-api";
import { useQueryInvalidation } from "../queries/use-query-invalidation";
import { queryKeyStore } from "../queries/queryKeys";

export function useChanges(repoPath) {
  // console.log("useChanges repoPath", repoPath);
  const queryClient = useQueryClient();
  const { invalidateStatus } = useQueryInvalidation();

  const stagingMutation = useMutation({
    mutationFn: (args) => {
      return stageFile(args.repoPath, args.filePath);
    },
    onSuccess: () => {
      console.log("Staged file/s, refreshing status");

      // queryClient.invalidateQueries({
      //   queryKey: ["status", repoPath],
      // });
      // queryClient.invalidateQueries({
      //   queryKey: ["numstat", repoPath],
      // });
      invalidateStatus(repoPath);
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
      // useAppStore.getState().triggerRefresh();
      // queryClient.invalidateQueries({
      //   queryKey: ["status", repoPath],
      // });
      // queryClient.invalidateQueries({
      //   queryKey: ["numstat", repoPath],
      // });
      invalidateStatus(repoPath);
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
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["numstat", repoPath],
        queryFn: () => {
          return getDiffNumstat(repoPath);
        },
        refetchOnWindowFocus: true,
      },
    ],
    combine: ([status, numstat]) => {
      const statusFiles = status.data ?? [];
      const numstatFiles = numstat.data ?? [];

      const numstatMap = new Map(numstatFiles.map((file) => [file.filePath, file]));

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


// Ahead behind count for the current branch you are on.
export function useAheadBehindCount(repoPath) {
  const aheadBehindQuery = useQuery({
    queryKey: queryKeyStore.aheadBehind(repoPath),
    queryFn: () => { return getAheadBehindCount(repoPath) },
  })

  return aheadBehindQuery;
}
