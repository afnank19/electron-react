import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyStore } from "../queries/queryKeys";
import {
  getRemotes,
  pushToRemote,
  pullFromRemote,
  fetchFromRemote,
  addRemote,
} from "../api/git-api/git-remotes-api";

export function useRemotes(repoPath: string) {
  const remotesQuery = useQuery({
    queryKey: queryKeyStore.remote(repoPath),
    queryFn: () => getRemotes(repoPath),
    enabled: !!repoPath,
  });

  const pushMutation = useMutation({
    mutationFn: (remote: string) => pushToRemote(repoPath, remote),
  });

  const pullMutation = useMutation({
    mutationFn: (remote: string) => pullFromRemote(repoPath, remote),
  });

  const fetchMutation = useMutation({
    mutationFn: (remote: string) => fetchFromRemote(repoPath, remote),
  });

  const addRemoteMutation = useMutation({
    mutationFn: ({ remote, url }: { remote: string, url: string }) => addRemote(repoPath, remote, url),
  })

  return {
    remotesQuery,
    pushMutation,
    pullMutation,
    fetchMutation,
    addRemoteMutation
  };
}
