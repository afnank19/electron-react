import { useEffect, useState } from "react";
import { useAppStore, useGitLogStore, useRepoStore } from "../state/repo-store";
import { splitByNewLine } from "../utils/utils";

export const GitRemote = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const addLog = useGitLogStore((s) => s.addLog);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);

  const [remotes, setRemotes] = useState("");
  const parsedRemotes = remotes ? splitByNewLine(remotes) : null;

  const [activeRemote, setActiveRemote] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (repoPath === null) {
      return;
    }

    window.gitAPI
      .getRemotes(repoPath)
      .then(setRemotes)
      .catch((err) => {
        console.log("err: no remotes?");
      });
  }, [repoPath]);

  // useEffect(() => {
  //   console.log(remotes);
  // }, [remotes]);

  function pushToRemote(remote) {
    console.log("pushing to", remote);
    setIsPending(true);
    addLog("Pushing to " + remote + ". Please Wait...");
    window.gitAPI
      .push(repoPath, remote)
      .then(addLog)
      .catch((err) => {
        addLog(err.message);
      })
      .finally(() => {setIsPending(false)});

    triggerRefresh();
  }

  function pullFromRemote(remote) {
    console.log("pulling from", remote);
    addLog("Pulling from " + remote + ". Please Wait...");
    setIsPending(true);
    window.gitAPI
      .pull(repoPath, remote)
      .then(addLog)
      .catch((err) => {
        addLog(err.message);
      })
      .finally(() => {setIsPending(false)});

    triggerRefresh();
  }

  return (
    <div className="border rounded-2xl border-neutral-700 p-2 mt-2 min-h-18">
      {remotes === "" ? (
        <div>No remotes set</div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold">Quick Actions</p>
            <div>
              <button
                className="font-bold text-xs border rounded-md px-2  border-blue-600 hover:bg-blue-600 mx-1"
                onClick={() => pushToRemote("origin")}
                disabled={isPending}
              >
                Push to Origin
              </button>
              <button
                onClick={() => pullFromRemote("origin")}
                className="font-bold text-xs border rounded-md px-2  border-blue-600 hover:bg-blue-600"
                disabled={isPending}
              >
                Pull from Origin
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex gap-2 items-center">
              <p className="text-sm font-bold">Active Remote</p>
              <select className="px-2 text-base">
                {parsedRemotes &&
                  parsedRemotes.map((remote, idx) => {
                    return (
                      <option key={idx} className="bg-black">
                        {remote}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div>
              <button
                onClick={() => pushToRemote(activeRemote)}
                disabled={isPending}
                className="font-bold text-xs border rounded-md px-2  border-neutral-700 hover:bg-neutral-600 mx-1"
              >
                Push to Remote
              </button>
              <button
                disabled={isPending}
                onClick={() => pullFromRemote(activeRemote)}
                className="font-bold text-xs border rounded-md px-2  border-neutral-700 hover:bg-neutral-600"
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
