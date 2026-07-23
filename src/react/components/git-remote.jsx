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
  const [selectedAction, setSelectedAction] = useState("push");

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

  function executeAction(remote) {
    switch (selectedAction) {
      case "push":
        pushToRemote(remote);
        break;
      case "pull":
        pullFromRemote(remote);
        break;
      case "fetch":
        fetchFromRemote(remote);
        break;
    }
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
  const actionPrefix = selectedAction === "push" ? "To" : "From";

  return (
    <div className="h-full border border-neutral-800 p-2">
      {remotesQuery.isLoading ? (
        <div>Loading remotes...</div>
      ) : remotes.length === 0 ? (
        <div>No remotes set</div>
      ) : (
        <div className="flex gap-2 whitespace-nowrap">
          <div className="flex flex-nowrap items-center gap-2">
            <p className="text-sm font-bold">Remote:</p>
            <select
              className="border border-neutral-700 px-2 text-sm"
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
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1 text-xs">
              <input
                type="radio"
                name="remote-action"
                value="push"
                checked={selectedAction === "push"}
                onChange={() => setSelectedAction("push")}
              />
              Push
            </label>
            <label className="flex cursor-pointer items-center gap-1 text-xs">
              <input
                type="radio"
                name="remote-action"
                value="pull"
                checked={selectedAction === "pull"}
                onChange={() => setSelectedAction("pull")}
              />
              Pull
            </label>
            <label className="flex cursor-pointer items-center gap-1 text-xs">
              <input
                type="radio"
                name="remote-action"
                value="fetch"
                checked={selectedAction === "fetch"}
                onChange={() => setSelectedAction("fetch")}
              />
              Fetch
            </label>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={() => executeAction("origin")}
              disabled={isPending}
              className="border border-neutral-700 bg-neutral-800 px-2 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
            >
              {actionPrefix} Origin
            </button>
            <button
              onClick={() => executeAction(activeRemote)}
              disabled={isPending}
              className="border border-neutral-700 bg-neutral-800 px-2 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
            >
              {actionPrefix} Remote
            </button>
          </div>
        </div>
      )}
      <div className="mt-1 flex items-center gap-2 text-sm">
        <label className="font-bold">Name</label>
        <input
          type="text"
          placeholder="origin"
          className="border border-neutral-700 bg-neutral-900 px-1 text-sm"
          value={remoteName}
          onChange={(e) => {
            setRemoteName(e.target.value);
          }}
        />

        <label className="font-bold">URL</label>
        <input
          type="text"
          placeholder="https://github.com/user/repo.git"
          className="flex-1 border border-neutral-700 bg-neutral-900 px-1 text-sm"
          value={remoteUrl}
          onChange={(e) => {
            setRemoteUrl(e.target.value);
          }}
        />

        <button
          disabled={isPending}
          onClick={() => addRemote()}
          className="border border-neutral-700 bg-neutral-800 px-2 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
        >
          Add Remote
        </button>
      </div>
    </div>
  );
};
