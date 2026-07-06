import React, { useEffect, useState } from "react";
import {
  VIEWER_MODE,
  useAppStore,
  useRepoStore,
  useViewerStore,
} from "../state/repo-store";
import { useQuery } from "@tanstack/react-query";
import { getDiffNumstat } from "../api/git-api";
import { parseNumstat } from "../utils/utils";
import { DotSquareIcon, Minus, Plus } from "lucide-react";

const GitStatus = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const [status, setStatus] = useState("");
  const parsedStatus = status ? processStatus(status) : null;
  const refreshCounter = useAppStore((s) => s.refreshCounter);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);

  const setFileDiff = useViewerStore((s) => s.setFileDiff);
  const setViewerMode = useViewerStore((s) => s.setViewerMode);

  const [activePane, setActivePane] = useState("files");

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

    // BUG: runs immmediately, should put this in the then chain above probably
    window.gitAPI.status(repoPath).then(setStatus);
  }

  function handleRestoreAll() {
    window.gitAPI.restoreFile(repoPath, ".");
    window.gitAPI.status(repoPath).then(setStatus);
  }

  function handleStatusItemClick(rawItem) {
    const rawItemSplit = rawItem.trim().split(" ");
    console.log("rISplit", rawItemSplit);
    const filePath = rawItemSplit[rawItemSplit.length - 1];
    console.log("fp", filePath);

    setViewerMode(VIEWER_MODE.FILE);
    window.gitAPI.showFileDiff(repoPath, filePath).then((res) => {
      setFileDiff(res, filePath);
    });
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

  const {
    data: numstatData,
    isLoading: numstatLoad,
    isError: numstatErr,
  } = useQuery({
    queryKey: ["numstat", repoPath],
    queryFn: () => {
      console.log("getting numstat diff");
      return getDiffNumstat(repoPath);
    },
    select: (data) => {
      return parseNumstat(data);
    },
  });

  if (status === "") {
    return (
      <div className="min-h-72 border rounded-2xl border-neutral-800 m-2 overflow-hidden">
        <div className=" flex justify-between text-sm bg-neutral- border-neutral-800 border-b">
          <h1 className="font-bold px-2 border-r border-neutral-800   w-full py-1">
            Changes
          </h1>
          {/* <h1 className="font-bold px-2 border-neutral-800 w-full py-1">
            Stats
          </h1>*/}
          {/*  <h1 className="font-bold px-2 w-full py-1">Changes</h1>*/}
        </div>
        <p className="px-2 pt-1 italic text-center">
          Nothing to commit, working tree clean.
        </p>
      </div>
    );
  }

  // TODO: handle overflow so it looks good
  return (
    <>
      <div className="pb-1 border rounded-2xl border-neutral-800 bg-[#111111] m-2 overflow-hidden flex flex-col gap-2 min-h-72">
        <div className=" flex justify-between items-center text-sm  border-neutral-800 border-b">
          <h1 className="font-bold px-2  w-full py-1">
            Changes
          </h1>
          <div className="flex gap-1 text-nowrap mx-2">
            <button
              className="font-bold text-xs border rounded-md px-2  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
              onClick={handleStageAll}
            >
              Stage All
            </button>
            <button
              className="font-bold text-xs border rounded-md px-2 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
              onClick={handleRestoreAll}
            >
              Restore All
            </button>
          </div>
          {/* <h1 className="font-bold px-2 border-neutral-800 w-full py-1">
            Stats
          </h1>*/}
          {/*  <h1 className="font-bold px-2 w-full py-1">Changes</h1>*/}
        </div>

        {activePane === "stats" ? (
          <div className="px-2">
            {/* <p>{numstatData}</p>*/}
            {numstatData.map((numstatItem) => {
              return (
                <>
                  <div className="flex gap-2 items-center justify-between m-0 p-0">
                    <div className="flex gap-2 items-center">
                      <DotSquareIcon size={20} className="text-yellow-300" />
                      <p>{numstatItem.filePath}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-green-500">+{numstatItem.additions}</p>
                      <p className="text-red-600">-{numstatItem.deletions}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        ) : (
          <>
            <div className="px-2 overflow-auto min-h-60  max-h-60">
              {parsedStatus &&
                parsedStatus.map((st, idx) => {
                  return (
                    <div key={st} className="flex gap-2 items-center my-1 w-full">
                      <div className="flex gap-2">
                        <button
                          className="font-bold text-xs border rounded-md   border-[#00aa00] bg-[#008800] hover:bg-[#00aa00] hover:border-[#00cc00]"
                          onClick={() => {
                            handleStaging(st);
                          }}
                        >
                          <Plus size={18} strokeWidth={3} />
                        </button>
                        <button
                          className="font-bold text-xs border rounded-md   border-[#bb0000] bg-[#990000] hover:bg-[#bb0000] hover:border-[#dd0000]"
                          onClick={() => {
                            handleRestore(st);
                          }}
                        >
                          <Minus size={18} strokeWidth={3}/>
                        </button>
                      </div>
                      <button
                        className="w-full overflow-hidden group flex gap-4 items-center hover:bg-yellow-500 hover:text-black cursor-pointer"
                        onClick={() => {
                          handleStatusItemClick(st);
                        }}
                      >
                        <p
                          key={idx}
                          style={{ whiteSpace: "pre" }}
                          className="font-mono text-sm "
                        >
                          {idx === 0 ? "" + st : st}
                        </p>
                        <p className="italic text-sm text-black hidden group-hover:block text-nowrap">
                          Click to view diff
                        </p>
                      </button>
                      <div className="flex gap-2 text-xs font-bold">
                        <p className="text-green-500">+18</p>
                        <p className="text-red-600">-18</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GitStatus;
