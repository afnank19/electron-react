import { useEffect, useState } from "react";
import { splitByNewLine } from "../utils/utils";
import {
  VIEWER_MODE,
  useAppStore,
  useGitLogStore,
  useRepoStore,
  useViewerStore,
} from "../state/repo-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryInvalidation } from "../queries/use-query-invalidation";
import { useCommits } from "../hooks/use-commits";

export const GitCommits = () => {
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);

  const addLog = useGitLogStore((s) => s.addLog);
  const setCommitLog = useViewerStore((s) => s.setCommitLog);
  const setViewerMode = useViewerStore((s) => s.setViewerMode);
  const repoPath = useRepoStore((state) => state.repoPath);
  const [commitMsg, setCommitMsg] = useState("");
  const { invalidateStatus, invalidateAll } = useQueryInvalidation();
  const { commitQuery, genCommitMsgMutation, commitMutation } = useCommits(repoPath);

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    setCommitMsg("");
  }, [repoPath]);

  function handleOnCommitClick(commitItem) {
    console.log("clicking the commit", commitItem);
    const commitItemSplit = commitItem.split(" ");
    const commitHash = commitItemSplit[0];

    setViewerMode(VIEWER_MODE.COMMIT);
    window.gitAPI.getCommitLog(repoPath, commitHash).then((res) => {
      setCommitLog(res, commitHash);
    });
  }

  return (
    <div className="flex h-full flex-col gap-2 border border-neutral-800 py-1">
      <h1 className="px-2 font-bold">Commit History</h1>

      <div className="flex flex-col gap-2 border-b border-neutral-800 px-2 pb-4">
        <textarea
          placeholder="eg. feat: update README.md"
          className="min-w-20 flex-1 resize-none overflow-hidden border border-neutral-800 bg-neutral-900 px-2 text-sm"
          value={commitMsg}
          onChange={(e) => {
            setCommitMsg(e.target.value);
          }}
          rows={1}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
        ></textarea>
        <div className="flex items-center justify-between gap-1">
          <button
            className="border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
            onClick={() => {
              genCommitMsgMutation.mutate(null, {
                onSuccess: (data) => {
                  setCommitMsg(data);
                  addLog("INFO: Generated commit message for current changes");
                },
                onError: (error) => {
                  console.error("failed generation", error);
                  addLog("FATAL: Failed to generate commit message through LLM: " + error.message);
                },
              });
            }}
          >
            {genCommitMsgMutation.isPending ? "Generating" : "Generate with LLM"}
          </button>
          <button
            className="w-fit border border-orange-600 bg-orange-700 px-2 py-0.5 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-orange-500 hover:bg-orange-600"
            onClick={() => {
              commitMutation.mutate(commitMsg, {
                onSuccess: (log) => {
                  console.log("Successfully commited, should be refreshing rn");
                  setCommitMsg("");
                  addLog(log);
                  triggerRefresh();
                  invalidateAll(repoPath);
                },
                onError: (err) => {
                  addLog(err.message);
                },
              });
            }}
          >
            Commit with message
          </button>
        </div>
      </div>

      <div className="h-full overflow-auto">
        {commitQuery.data &&
          commitQuery.data.map((commit, idx) => {
            return (
              <div
                key={commit.hash}
                className="w-full cursor-pointer border-b border-neutral-800 text-sm hover:bg-neutral-700"
              >
                <div className="mx-2 flex gap-1">
                  <button
                    key={idx}
                    className="w-full text-left text-nowrap select-text"
                    onClick={() => handleOnCommitClick(commit.hash)}
                  >
                    {commit.subject}
                  </button>
                </div>
                <div className="mx-2 flex gap-2 text-xs text-neutral-400">
                  <p>{commit.author}</p>
                  <p>{commit.relativeDate}</p>
                  <button className="">{commit.hash}</button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
