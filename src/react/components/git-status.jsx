import React, { useEffect, useState } from "react";
import { VIEWER_MODE, useAppStore, useRepoStore, useViewerStore } from "../state/repo-store";
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
      <div className="h-full overflow-hidden border border-neutral-800">
        <div className="bg-neutral- flex justify-between border-b border-neutral-800 text-sm">
          <h1 className="w-full border-r border-neutral-800 px-2 py-1 font-bold">Changes</h1>
        </div>
        <p className="px-2 pt-1 text-center italic">Nothing to commit, working tree clean.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col gap-2 overflow-hidden border border-neutral-800 pb-1">
        <div className="flex items-center justify-between border-b border-neutral-800 text-sm">
          <h1 className="w-full px-2 py-1 font-bold">Changes</h1>
          <div className="mx-2 flex gap-1 text-nowrap">
            <button
              className="border border-neutral-700 bg-neutral-800 px-2 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
              onClick={() => {
                stagingMutation.mutate({ repoPath: repoPath, filePath: "." });
              }}
            >
              Stage All
            </button>
            <button
              className="border border-neutral-700 bg-neutral-800 px-2 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
              onClick={() => {
                restoringMutation.mutate({ repoPath: repoPath, filePath: "." });
              }}
            >
              Restore All
            </button>
          </div>
        </div>
        <>
          <div className="overflow-auto px-2">
            {result.files &&
              result.files.map((item, idx) => {
                return (
                  <div key={item.path} className="my-1 flex w-full items-center gap-2">
                    <button
                      className="group flex w-full cursor-pointer items-center gap-4 overflow-hidden hover:bg-yellow-500 hover:text-black"
                      onClick={() => {
                        handleStatusItemClick(item.path);
                      }}
                      title={item.path} // Could use a more customizeable tooltip
                    >
                      <div
                        className={`flex items-center gap-2 text-sm ${item.staged ? "font-bold text-lime-300 group-hover:text-black" : ""}`}
                      >
                        <div className="flex items-center gap-1 border-r border-neutral-700 pr-2 font-mono">
                          <p className="">{item.indexSymbol === " " ? "-" : item.indexSymbol}</p>
                          <p className="">
                            {item.workingTreeSymbol === " " ? "-" : item.workingTreeSymbol}
                          </p>
                        </div>
                        <p key={item.path} style={{ whiteSpace: "pre" }} className="text-sm">
                          {item.filename}
                        </p>
                        <p
                          key={idx}
                          style={{ whiteSpace: "pre" }}
                          className="truncate text-xs text-neutral-400 group-hover:text-neutral-700"
                        >
                          /{item.path}
                        </p>
                      </div>
                      <p className="hidden text-sm text-nowrap text-black italic group-hover:block">
                        Click to view diff
                      </p>
                    </button>
                    <div className="flex gap-2 text-xs font-bold">
                      <p className="text-green-500">+{item.additions}</p>
                      <p className="text-red-600">-{item.deletions}</p>
                      <div className="flex gap-2">
                        {item.staged ? (
                          <button
                            className="flex items-center gap-1 border border-neutral-700 bg-neutral-800 pr-1 pl-0.5 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
                            onClick={() => {
                              restoringMutation.mutate({
                                repoPath: repoPath,
                                filePath: item.path,
                              });
                            }}
                          >
                            <Minus size={10} strokeWidth={3} className="text-neutral-400" />
                            Restore
                          </button>
                        ) : (
                          <button
                            className="flex items-center gap-1 border border-neutral-700 bg-neutral-800 pr-1 pl-0.5 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
                            onClick={() => {
                              // handleStaging(item.path);
                              stagingMutation.mutate({
                                repoPath: repoPath,
                                filePath: item.path,
                              });
                            }}
                          >
                            <Plus size={10} strokeWidth={3} className="text-neutral-400" />
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
