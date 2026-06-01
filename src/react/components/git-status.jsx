import React, { useEffect, useState } from "react";
import { useAppStore, useRepoStore } from "../state/repo-store";

const GitStatus = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  const [status, setStatus] = useState("");

  const parsedStatus = status ? processStatus(status) : null;

  const refreshCounter = useAppStore((s) => s.refreshCounter);

  useEffect(() => {
    // reload data
    console.log("refresh triggered");
    window.gitAPI.status(repoPath).then(setStatus);
  }, [refreshCounter]);

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    window.gitAPI.status(repoPath).then(setStatus);
    console.log(status);
    const splitStatusL = status.split("\n");
    console.log("split", splitStatusL);
    console.log("split", splitStatusL[0]);
  }, [repoPath]);

  function processStatus(status) {
    return status.split("\n").slice(0, -1);
  }

  function handleStaging(currentItem) {
    const filePath = currentItem.split(" ").pop();
    console.log("staging ", filePath);

    window.gitAPI.stageFile(repoPath, filePath);
    window.gitAPI.status(repoPath).then(setStatus);
  }

  function handleRestore(currentItem) {
    const filePath = currentItem.split(" ").pop();
    console.log("staging ", filePath);

    window.gitAPI.restoreFile(repoPath, filePath);
    window.gitAPI.status(repoPath).then(setStatus);
  }

  function handleStageAll() {
    window.gitAPI.stageFile(repoPath, ".");
    window.gitAPI.status(repoPath).then(setStatus);
  }

  function handleRestoreAll() {
    window.gitAPI.restoreFile(repoPath, ".");
    window.gitAPI.status(repoPath).then(setStatus);
  }

  useEffect(() => {
    function handleFocus() {
      console.log("window focused");

      console.log("repo path in focus code", repoPath);

      // refresh git status here
      window.gitAPI.status(repoPath).then(setStatus);
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [repoPath]);

  if (status === "") {
    return (
      <div className="m-2">INFO: No changes or modifications to any files.</div>
    );
  }

  // TODO: handle overflow so it looks good
  return (
    <>
      <div className="py-1 border rounded-2xl border-neutral-800 m-2  flex flex-col gap-2">
        <h1 className="font-bold px-2 pt-1">Files // Status</h1>

        <div className="px-2">
          {parsedStatus &&
            parsedStatus.map((st, idx) => {
              return (
                <div className="flex gap-2 items-center my-1">
                  <div className="flex gap-1">
                    <button
                      className="font-bold text-xs border rounded-lg px-2 py-1 border-green-900 hover:bg-green-800"
                      onClick={() => {
                        handleStaging(st);
                      }}
                    >
                      Stage
                    </button>
                    <button
                      className="font-bold text-xs border rounded-lg px-2 py-1 border-red-900 hover:bg-red-800"
                      onClick={() => {
                        handleRestore(st);
                      }}
                    >
                      Restore
                    </button>
                  </div>
                  <p
                    key={idx}
                    style={{ whiteSpace: "pre-wrap" }}
                    className="font-mono text-sm"
                  >
                    {idx === 0 ? "" + st : st}
                  </p>
                </div>
              );
            })}
        </div>
        <div className="flex gap-1 border-t border-neutral-700 p-2">
          <button
            className="font-bold text-xs border rounded-lg px-2 py-1 border-neutral-700 hover:bg-neutral-800"
            onClick={handleStageAll}
          >
            Stage All
          </button>
          <button
            className="font-bold text-xs border rounded-lg px-2 py-1 border-neutral-700 hover:bg-neutral-800"
            onClick={handleRestoreAll}
          >
            Restore All
          </button>
        </div>
      </div>
    </>
  );
};

export default GitStatus;
