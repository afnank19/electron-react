import React, { useEffect, useState } from "react";
import {
  VIEWER_MODE,
  useAppStore,
  useRepoStore,
  useViewerStore,
} from "../state/repo-store";
import { useQuery } from "@tanstack/react-query";
import { getDiffNumstat } from "../api/git-api";
import { parseGitStatusPorcelain, parseNumstat } from "../utils/utils";
import { DotSquareIcon, Minus, Plus } from "lucide-react";

const GitStatus = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const [status, setStatus] = useState("");
  const parsedStatus = status ? processStatus(status) : null;
  const processedStatus = status ? parseGitStatusPorcelain(status) : null;
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
      <div className="border border-neutral-800  overflow-hidden h-full">
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
      <div className="pb-1 border border-neutral-800 bg-[#111111] overflow-hidden flex flex-col gap-2 h-full">
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
            <div className="px-2 overflow-auto">
              {processedStatus &&
                processedStatus.map((item, idx) => {
                  return (
                    <div key={item.path} className="flex gap-2 items-center my-1 w-full">
                      <div className="flex gap-2">
                        <button
                          className="font-bold text-xs border rounded-md   border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
                          onClick={() => {
                            handleStaging(item.path);
                          }}
                        >
                          <Plus size={18} strokeWidth={3} className="text-neutral-400" />
                        </button>
                        <button
                          className="font-bold text-xs border rounded-md   border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
                          onClick={() => {
                            handleRestore(item.path);
                          }}
                        >
                          <Minus size={18} strokeWidth={3} className="text-neutral-400"/>
                        </button>
                      </div>
                      <button
                        className="w-full overflow-hidden group flex gap-4 items-center hover:bg-yellow-500 hover:text-black cursor-pointer"
                        onClick={() => {
                          handleStatusItemClick(item.path);
                        }}
                      >
                        <div className="flex text-sm gap-2 items-center">
                          <div className="flex gap-1 items-center">
                            <p className="">{ item.indexSymbol  === " " ? "_" : item.indexSymbol }</p>
                            <p className="">{ item.workingTreeSymbol  === " " ? "_" : item.workingTreeSymbol }</p>
                          </div>
                          <p
                            key={idx}
                            style={{ whiteSpace: "pre" }}
                            className="text-sm "
                          >
                            {item.filename}
                          </p>
                          <p
                            key={idx}
                            style={{ whiteSpace: "pre" }}
                            className="text-xs text-neutral-400 group-hover:text-neutral-700 "
                          >
                            {item.path}
                          </p>
                        </div>
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
