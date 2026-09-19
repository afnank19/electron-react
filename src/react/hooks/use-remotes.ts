import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyStore } from "../queries/queryKeys";
import {
  getRemotes,
  pushToRemote,
  pullFromRemote,
  fetchFromRemote,
  addRemote,
} from "../api/git-api/git-remotes-api";

export function useRemotes(repoPath: string | null) {
  const remotesQuery = useQuery({
    queryKey: queryKeyStore.remote(repoPath),
    queryFn: () => {
      if (!repoPath) throw new Error("No repository is active.");
      return getRemotes(repoPath);
    },
    enabled: !!repoPath,
  });

  const pushMutation = useMutation({
    mutationFn: (remote: string) => {
      if (!repoPath) throw new Error("No repository is active.");
      return pushToRemote(repoPath, remote);
    },
  });

  const pullMutation = useMutation({
    mutationFn: (remote: string) => {
      if (!repoPath) throw new Error("No repository is active.");
      return pullFromRemote(repoPath, remote);
    },
  });

  const fetchMutation = useMutation({
    mutationFn: (remote: string) => {
      if (!repoPath) throw new Error("No repository is active.");
      return fetchFromRemote(repoPath, remote);
    },
  });

  const addRemoteMutation = useMutation({
    mutationFn: ({ remote, url }: { remote: string; url: string }) => {
      if (!repoPath) throw new Error("No repository is active.");
      return addRemote(repoPath, remote, url);
    },
  });

  return {
    remotesQuery,
    pushMutation,
    pullMutation,
    fetchMutation,
    addRemoteMutation,
  };
}
