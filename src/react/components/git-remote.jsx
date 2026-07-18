import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore, useGitLogStore, useRepoStore } from "../state/repo-store";
import { useRemotes } from "../hooks/use-remotes";
import { queryKeyStore } from "../queries/queryKeys";
import { useQueryInvalidation } from "../queries/use-query-invalidation";

export const GitRemote = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const addLog = useGitLogStore((s) => s.addLog);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);
  const queryClient = useQueryClient();

  const { remotesQuery, pushMutation, pullMutation } = useRemotes(repoPath);
  const { invalidateAll } = useQueryInvalidation();

  const remotes = remotesQuery.data ?? [];
  const [activeRemote, setActiveRemote] = useState("");

  useEffect(() => {
    if (remotes.length > 0 && !activeRemote) {
      setActiveRemote(remotes[0]);
    }
  }, [remotes]);

  function pushToRemote(remote) {
    addLog("Pushing to " + remote + ". Please Wait...");
    pushMutation.mutate(remote, {
      onSuccess: (res) => {
        addLog(res);
        invalidateAll(repoPath);
        triggerRefresh();
      },
      onError: (err) => {
        addLog(err.message);
      },
    });
  }

  function pullFromRemote(remote) {
    addLog("Pulling from " + remote + ". Please Wait...");
    pullMutation.mutate(remote, {
      onSuccess: (res) => {
        addLog(res);
        invalidateAll(repoPath);
        triggerRefresh();
      },
      onError: (err) => {
        addLog(err.message);
      },
    });
  }

  const isPending = pushMutation.isPending || pullMutation.isPending;

  return (
    <div className="border border-neutral-800 bg-[#111111] p-2 h-full">
      {remotesQuery.isLoading ? (
        <div>Loading remotes...</div>
      ) : remotes.length === 0 ? (
        <div>No remotes set</div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold">Quick Actions</p>
            <div>
              <button
                className="font-bold text-xs border  shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2  bg-orange-700 border-orange-600 hover:bg-orange-600 hover:border-orange-500 mx-1"
                onClick={() => pushToRemote("origin")}
                disabled={isPending}
              >
                Push to Origin
              </button>
              <button
                onClick={() => pullFromRemote("origin")}
                className="font-bold text-xs border px-2  bg-orange-700 border-orange-600 hover:bg-orange-600 hover:border-orange-500  shadow-[3px_3px_0px_rgba(0,0,0,0.9)]"
                disabled={isPending}
              >
                Pull from Origin
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex gap-2 items-center">
              <p className="text-sm font-bold">Active Remote:</p>
              <select
                className="px-2 text-base"
                value={activeRemote}
                onChange={(e) => setActiveRemote(e.target.value)}
              >
                {remotes.map((remote, idx) => (
                  <option key={idx} className="bg-black">
                    {remote}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center justify-center">
              <button
                onClick={() => pushToRemote(activeRemote)}
                disabled={isPending}
                className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 mx-1"
              >
                Push to Remote
              </button>
              <button
                disabled={isPending}
                onClick={() => pullFromRemote(activeRemote)}
                className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
              >
                Pull from Remote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
