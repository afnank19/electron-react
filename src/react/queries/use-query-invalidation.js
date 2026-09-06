import { useQueryClient } from "@tanstack/react-query";
import { queryKeyStore } from "./queryKeys";

export function useQueryInvalidation() {
  const queryClient = useQueryClient();

  const invalidateStatus = (repoPath) => {
    queryClient.invalidateQueries({
      queryKey: queryKeyStore.status(repoPath),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeyStore.numstat(repoPath),
    });
  };

  const invalidateCommits = (repoPath) => {
    queryClient.invalidateQueries({
      queryKey: queryKeyStore.commit(repoPath),
    });
  };

  const invalideRemotes = (repoPath) => {
    queryClient.invalidateQueries({
      queryKey: queryKeyStore.remote(repoPath),
    });
  };

  const invalidateAheadBehind = (repoPath) => {
    queryClient.invalidateQueries({
      queryKey: queryKeyStore.aheadBehind(repoPath)
    })
  }

  const invalidateAll = (repoPath) => {
    invalidateCommits(repoPath);
    invalidateStatus(repoPath);

    // Probably move into its own func
    queryClient.invalidateQueries({
      queryKey: queryKeyStore.branch(repoPath),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeyStore.activeBranch(repoPath),
    });

    invalideRemotes(repoPath);
    invalidateAheadBehind(repoPath);
  };

  return {
    invalidateAll,
    invalidateStatus,
    invalidateCommits,
    invalideRemotes,
  };
}
