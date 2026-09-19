import { useEffect, useRef } from "react";
import { useRemotes } from "./use-remotes";
import { useGitLogStore } from "../state/repo-store";
import { useQueryInvalidation } from "../queries/use-query-invalidation";

export function useRepoFetchOnActivation(repoPath: string | null) {
  const { remotesQuery, fetchMutation } = useRemotes(repoPath);
  const { data: remotes = [], isLoading, isError } = remotesQuery;
  const { mutate } = fetchMutation;
  const addLog = useGitLogStore((state) => state.addLog);
  const { invalidateAll } = useQueryInvalidation();
  const fetchedRepos = useRef(new Set<string>());
  const fetchingRepos = useRef(new Set<string>());

  useEffect(() => {
    if (!repoPath || isLoading || isError) return;

    const remote = remotes.includes("origin") ? "origin" : remotes[0];
    if (fetchedRepos.current.has(repoPath) || fetchingRepos.current.has(repoPath)) return;

    if (!remote) {
      addLog("SYSTEM: No remote configured, skipping fetch.");
      return;
    }

    fetchingRepos.current.add(repoPath);
    addLog(`SYSTEM: Fetching ${remote}...`);
    mutate(remote, {
      onSuccess: (output) => {
        fetchingRepos.current.delete(repoPath);
        fetchedRepos.current.add(repoPath);
        addLog(
          output ? `SYSTEM: Fetch completed: ${output}` : "SYSTEM: Fetch completed, up to date.",
        );
        invalidateAll(repoPath);
      },
      onError: (error: Error) => {
        fetchingRepos.current.delete(repoPath);
        addLog(`ERROR: Fetch failed: ${error.message}`);
      },
    });
  }, [addLog, invalidateAll, isError, isLoading, mutate, repoPath, remotes]);
}
