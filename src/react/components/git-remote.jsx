import { useEffect, useState } from "react";
import { useGitLogStore, useRepoStore } from "../state/repo-store";
import { splitByNewLine } from "../utils/utils";

export const GitRemote = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const addLog = useGitLogStore((s) => s.addLog);

  const [remotes, setRemotes] = useState("");
  const parsedRemotes = remotes ? splitByNewLine(remotes) : null;

  const [activeRemote, setActiveRemote] = useState("");

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
    window.gitAPI
      .push(repoPath, remote)
      .then(addLog)
      .catch((err) => {
        addLog(err.message);
      });
  }

  function pullFromRemote(remote) {
    console.log("pulling from", remote);
    window.gitAPI
      .pull(repoPath, remote)
      .then(addLog)
      .catch((err) => {
        addLog(err.message);
      });
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
              >
                Push to Origin
              </button>
              <button className="font-bold text-xs border rounded-md px-2  border-blue-600 hover:bg-blue-600">
                Pull from Origin
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <p className="text-sm font-bold">Remote</p>
              <select className="border rounded-md border-neutral-500 px-2 text-sm">
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
                className="font-bold text-xs border rounded-md px-2  border-neutral-700 hover:bg-neutral-600 mx-1"
              >
                Push to Remote
              </button>
              <button className="font-bold text-xs border rounded-md px-2  border-neutral-700 hover:bg-neutral-600">
                Pull from Remote
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
