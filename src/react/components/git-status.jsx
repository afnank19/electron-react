import React, { useEffect, useState } from "react";
import {
  VIEWER_MODE,
  useAppStore,
  useRepoStore,
  useViewerStore,
} from "../state/repo-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDiffNumstat } from "../api/git-api";
import { parseGitStatusPorcelain, parseNumstat } from "../utils/utils";
import { DotSquareIcon, Minus, Plus } from "lucide-react";
import { useChanges } from "../hooks/use-changes";
import { useQueryInvalidation } from "../queries/use-query-invalidation";

const GitStatus = () => {
  const queryClient = useQueryClient();

  const repoPath = useRepoStore((state) => state.repoPath);
  // const [status, setStatus] = useState("");
  // const parsedStatus = status ? processStatus(status) : null;
  // const processedStatus = status ? parseGitStatusPorcelain(status) : null;
  // const refreshCounter = useAppStore((s) => s.refreshCounter);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);

  const setFileDiff = useViewerStore((s) => s.setFileDiff);
  const setViewerMode = useViewerStore((s) => s.setViewerMode);

  const { result, stagingMutation, restoringMutation } = useChanges(repoPath);
  const { invalidateStatus, invalidateAll } = useQueryInvalidation();

  function handleStatusItemClick(rawItem) {
    const rawItemSplit = rawItem.trim().split(" ");
    const filePath = rawItemSplit[rawItemSplit.length - 1];

    setViewerMode(VIEWER_MODE.FILE);
    window.gitAPI.showFileDiff(repoPath, filePath).then((res) => {
      setFileDiff(res, filePath);
    });
  }

  useEffect(() => {
    function handleFocus() {
      console.log("window focused");

      // refresh git status here
      triggerRefresh();
      // queryClient.invalidateQueries({
      //   queryKey: ["status", repoPath],
      // });
      // queryClient.invalidateQueries({
      //   queryKey: ["numstat", repoPath],
      // });
      // invalidateStatus(repoPath);
      invalidateAll(repoPath);
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [repoPath]);

  if (result.files.length === 0) {
    return (
      <div className="border border-neutral-800  overflow-hidden h-full">
        <div className=" flex justify-between text-sm bg-neutral- border-neutral-800 border-b">
          <h1 className="font-bold px-2 border-r border-neutral-800   w-full py-1">
            Changes
          </h1>
        </div>
        <p className="px-2 pt-1 italic text-center">
          Nothing to commit, working tree clean.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="pb-1 border border-neutral-800 overflow-hidden flex flex-col gap-2 h-full">
        <div className=" flex justify-between items-center text-sm  border-neutral-800 border-b">
          <h1 className="font-bold px-2  w-full py-1">Changes</h1>
          <div className="flex gap-1 text-nowrap mx-2">
            <button
              className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
              onClick={() => {
                stagingMutation.mutate({ repoPath: repoPath, filePath: "." });
              }}
            >
              Stage All
            </button>
            <button
              className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
              onClick={() => {
                restoringMutation.mutate({ repoPath: repoPath, filePath: "." });
              }}
            >
              Restore All
            </button>
          </div>
        </div>
        <>
          <div className="px-2 overflow-auto">
            {result.files &&
              result.files.map((item, idx) => {
                return (
                  <div
                    key={item.path}
                    className="flex gap-2 items-center my-1 w-full"
                  >
                    <button
                      className="w-full overflow-hidden group flex gap-4 items-center hover:bg-yellow-500 hover:text-black cursor-pointer"
                      onClick={() => {
                        handleStatusItemClick(item.path);
                      }}
                      title={item.path} // Could use a more customizeable tooltip
                    >
                      <div
                        className={`flex text-sm gap-2 items-center ${item.staged ? "text-lime-300 group-hover:text-black font-bold" : ""}`}
                      >
                        <div className="flex gap-1 items-center font-mono border-r pr-2 border-neutral-700">
                          <p className="">
                            {item.indexSymbol === " " ? "-" : item.indexSymbol}
                          </p>
                          <p className="">
                            {item.workingTreeSymbol === " "
                              ? "-"
                              : item.workingTreeSymbol}
                          </p>
                        </div>
                        <p
                          key={item.path}
                          style={{ whiteSpace: "pre" }}
                          className="text-sm "
                        >
                          {item.filename}
                        </p>
                        <p
                          key={idx}
                          style={{ whiteSpace: "pre" }}
                          className="text-xs text-neutral-400 group-hover:text-neutral-700 truncate"
                        >
                          /{item.path}
                        </p>
                      </div>
                      <p className="italic text-sm text-black hidden group-hover:block text-nowrap">
                        Click to view diff
                      </p>
                    </button>
                    <div className="flex gap-2 text-xs font-bold">
                      <p className="text-green-500">+{item.additions}</p>
                      <p className="text-red-600">-{item.deletions}</p>
                      <div className="flex gap-2">
                        {item.staged ? (
                          <button
                            className="font-bold flex items-center gap-1 pl-0.5 pr-1 text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)]  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
                            onClick={() => {
                              restoringMutation.mutate({
                                repoPath: repoPath,
                                filePath: item.path,
                              });
                            }}
                          >
                            <Minus
                              size={10}
                              strokeWidth={3}
                              className="text-neutral-400"
                            />
                            Restore
                          </button>
                        ) : (
                          <button
                            className="font-bold flex items-center gap-1 pl-0.5 pr-1 text-xs border  shadow-[3px_3px_0px_rgba(0,0,0,0.9)]  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
                            onClick={() => {
                              // handleStaging(item.path);
                              stagingMutation.mutate({
                                repoPath: repoPath,
                                filePath: item.path,
                              });
                            }}
                          >
                            <Plus
                              size={10}
                              strokeWidth={3}
                              className="text-neutral-400"
                            />
                            Stage
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      </div>
    </>
  );
};

export default GitStatus;
