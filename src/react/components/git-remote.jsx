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

  const { remotesQuery, pushMutation, pullMutation, fetchMutation, addRemoteMutation } =
    useRemotes(repoPath);
  const { invalidateAll, invalideRemotes } = useQueryInvalidation();

  const remotes = remotesQuery.data ?? [];
  const [activeRemote, setActiveRemote] = useState("");

  const [remoteName, setRemoteName] = useState("");
  const [remoteUrl, setRemoteUrl] = useState("");

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

  function fetchFromRemote(remote) {
    addLog("Fetching from " + remote + ". Please Wait...");
    fetchMutation.mutate(remote, {
      onSuccess: (res) => {
        if (res === "") {
          addLog("SYSTEM: Fetch successful, up to date");
        } else {
          addLog(res);
        }
        invalidateAll(repoPath);
        triggerRefresh();
      },
      onError: (err) => {
        addLog(err.message);
      },
    });
  }

  function addRemote() {
    if (remoteName === "" || remoteUrl === "") {
      addLog("SYSTEM: Could not add remote, Empty fields (name or url).");
      return;
    }

    addRemoteMutation.mutate(
      { remote: remoteName, url: remoteUrl },
      {
        onSuccess: (output) => {
          addLog("SYSTEM: Added Remote " + remoteName);
          invalideRemotes(repoPath);
          setRemoteName("");
          setRemoteUrl("");
        },
        onError: (err) => {
          addLog(err.message);
        },
      },
    );
  }

  const isPending = pushMutation.isPending || pullMutation.isPending || fetchMutation.isPending;

  return (
    <div className="border border-neutral-800 p-2 h-full">
      {remotesQuery.isLoading ? (
        <div>Loading remotes...</div>
      ) : remotes.length === 0 ? (
        <div>No remotes set</div>
      ) : (
        <div className="flex flex-col gap-1  whitespace-nowrap">
          <div className="flex items-center flex-1 gap-2 flex-nowrap justify-between">
            <p className="text-sm font-bold">Quick Actions</p>
            <div className="flex items-center flex-nowrap whitespace-nowrap">
              <button
                className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 mx-1"
                onClick={() => fetchFromRemote("origin")}
                disabled={isPending}
              >
                Fetch from Origin
              </button>
              <button
                className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 mx-1"
                onClick={() => pushToRemote("origin")}
                disabled={isPending}
              >
                Push to Origin
              </button>
              <button
                onClick={() => pullFromRemote("origin")}
                className="font-bold text-xs border px-2 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600  shadow-[3px_3px_0px_rgba(0,0,0,0.9)]"
                disabled={isPending}
              >
                Pull from Origin
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-1 justify-between">
            <div className="flex gap-1 items-center">
              <p className="text-sm font-bold">Remote:</p>
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
            <div className="flex items-center justify-center whitespace-nowrap">
              <button
                onClick={() => fetchFromRemote(activeRemote)}
                disabled={isPending}
                className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 mx-1"
              >
                Fetch from Remote
              </button>
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
      <div className="flex gap-2 text-sm items-center mt-1">
        <label>Name</label>
        <input
          type="text"
          placeholder="origin"
          className="px-1 text-sm border border-neutral-700 bg-neutral-900"
          value={remoteName}
          onChange={(e) => {
            setRemoteName(e.target.value);
          }}
        />

        <label>URL</label>
        <input
          type="text"
          placeholder="https://github.com/user/repo.git"
          className="flex-1 px-1 text-sm border border-neutral-700 bg-neutral-900"
          value={remoteUrl}
          onChange={(e) => {
            setRemoteUrl(e.target.value);
          }}
        />

        <button
          disabled={isPending}
          onClick={() => addRemote()}
          className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
        >
          Add Remote
        </button>
      </div>
    </div>
  );
};
