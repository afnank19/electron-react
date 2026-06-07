import React, { useEffect, useState } from "react";
import { useAppStore, useRepoStore, useViewerStore } from "../state/repo-store";

const GitStatus = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const [status, setStatus] = useState("");
  const parsedStatus = status ? processStatus(status) : null;
  const refreshCounter = useAppStore((s) => s.refreshCounter);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh)

  const setFileDiff = useViewerStore((s) => s.setFileDiff);

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

  function handleStatusItemClick(rawItem) {
    const rawItemSplit = rawItem.trim().split(" ")
    console.log("rISplit", rawItemSplit)
    const filePath = rawItemSplit[rawItemSplit.length - 1]
    console.log("fp", filePath)

    window.gitAPI.showFileDiff(repoPath, filePath).then(setFileDiff)
  }

  useEffect(() => {
    function handleFocus() {
      console.log("window focused");

      console.log("repo path in focus code", repoPath);

      // refresh git status here
      window.gitAPI.status(repoPath).then(setStatus);
      triggerRefresh();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [repoPath]);

  if (status === "") {
    return (
      <div className="min-h-72 border rounded-2xl border-neutral-800 m-2">
        <h1 className="font-bold px-2 pt-1">Files // Status</h1>
        <p className="px-2 pt-1 italic text-center">
          Nothing to commit, working tree clean.
        </p>
      </div>
    );
  }

  // TODO: handle overflow so it looks good
  return (
    <>
      <div className="py-1 border rounded-2xl border-neutral-800 m-2  flex flex-col gap-2 min-h-72">
        <h1 className="font-bold px-2 pt-1">Files // Status</h1>

        <div className="px-2 overflow-auto min-h-50  max-h-50">
          {parsedStatus &&
            parsedStatus.map((st, idx) => {
              return (
                <div className="flex gap-2 items-center my-1">
                  <div className="flex gap-1">
                    <button
                      className="font-bold text-xs border rounded-md px-2  border-[#008800] hover:bg-[#008800]"
                      onClick={() => {
                        handleStaging(st);
                      }}
                    >
                      Stage
                    </button>
                    <button
                      className="font-bold text-xs border rounded-md px-2  border-[#990000] hover:bg-[#990000]"
                      onClick={() => {
                        handleRestore(st);
                      }}
                    >
                      Restore
                    </button>
                  </div>
                  <button className="w-full group flex gap-4 items-center hover:bg-yellow-500 hover:text-black cursor-pointer"
                    onClick={() => {handleStatusItemClick(st)}}
                  >
                    <p
                      key={idx}
                      style={{ whiteSpace: "pre" }}
                      className="font-mono text-sm "
                    >
                      {idx === 0 ? "" + st : st}
                    </p>
                    <p className="italic text-sm text-black hidden group-hover:block text-nowrap">Click to view diff</p>
                  </button>
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
