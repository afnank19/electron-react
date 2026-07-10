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

  return {
    invalidateStatus,
  };
}
