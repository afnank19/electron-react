import { useQuery } from "@tanstack/react-query";
import { queryKeyStore } from "../queries/queryKeys";
import { getCommits } from "../api/git-api/git-commit-api";

export function useCommits(repoPath: string) {
  const commitQuery = useQuery({
    queryKey: queryKeyStore.commit(repoPath),
    queryFn: () => {
      return getCommits(repoPath);
    },
    refetchOnWindowFocus: true
  })


  return {
    commitQuery
  }
}
