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
  const repoPath = useRepoStore((state) => state.repoPath);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);
  const refreshCounter = useAppStore((s) => s.refreshCounter);
  const addLog = useGitLogStore((s) => s.addLog);

  const [commits, setCommits] = useState("");
  const parsedCommits = commits ? splitByNewLine(commits) : null;

  const setCommitLog = useViewerStore((s) => s.setCommitLog);
  const setViewerMode = useViewerStore((s) => s.setViewerMode);

  const [commitMsg, setCommitMsg] = useState("");

  const { invalidateStatus } = useQueryInvalidation();
  const { commitQuery } = useCommits(repoPath);

  useEffect(() => {
    // reload data
    console.log("commit refresh triggered");
    window.gitAPI
      .commits(repoPath)
      .then(setCommits)
      .catch((err) => {
        setCommits("");
      });
  }, [refreshCounter]);

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    setCommitMsg("");
    window.gitAPI
      .commits(repoPath)
      .then(setCommits)
      .catch((err) => {
        setCommits("");
      });
  }, [repoPath]);

  function handleOnCommit() {
    setCommitMsg("");
    window.gitAPI
      .commitChange(repoPath, commitMsg)
      .then(addLog)
      .catch((err) => {
        addLog(err.message);
      });
    window.gitAPI.commits(repoPath).then(setCommits);

    triggerRefresh();
    invalidateStatus(repoPath);
  }

  function handleOnCommitClick(commitItem) {
    console.log("clicking the commit", commitItem);
    const commitItemSplit = commitItem.split(" ");
    const commitHash = commitItemSplit[0];

    setViewerMode(VIEWER_MODE.COMMIT);
    window.gitAPI.getCommitLog(repoPath, commitHash).then((res) => {
      setCommitLog(res, commitHash);
    });
  }

  // Jinkies mate
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const headDiff = await window.gitAPI.getHeadDiff(repoPath);
      console.log("head diff", headDiff);
      // return generateCommitMessage(headDiff);
      return window.ai.commitMsg(headDiff);
    },
    onSuccess: (data) => {
      console.log("succeeded in generation", data);
      setCommitMsg(data);
      addLog("INFO: Generated commit message for current changes");
    },
    onError: (error) => {
      console.error("failed generation", error);
      addLog(
        "FATAL: Failed to generate commit message through LLM: " +
          error.message,
      );
    },
  });

  return (
    <div className="text-white flex flex-col gap-2 border  border-neutral-800 bg-[#111111] py-1 h-full">
      <h1 className="font-bold px-2">Commit History</h1>

      <div className="flex flex-col gap-2 border-b border-neutral-800 pb-4 px-2">
          <textarea
            placeholder="eg. feat: update README.md"
            className="border border-neutral-800 bg-neutral-900 rounded-lg px-2 text-sm flex-1 resize-none overflow-hidden min-w-20"
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
        <div className="flex gap-1 items-center justify-between">
          <button
            className="font-bold text-xs border rounded-lg px-2 py-0.5  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
            onClick={() => {
              mutate();
            }}
          >
            {isPending ? "Generating" : "Generate with LLM"}
          </button>
        <button
          className="font-bold w-fit text-xs border rounded-lg px-2 py-0.5  bg-orange-700 border-orange-600 hover:bg-orange-600 hover:border-orange-500 shadow-xl"
          onClick={handleOnCommit}
        >
          Commit with message
        </button>
        </div>
      </div>

      <div className="overflow-auto h-full ">
        {commitQuery.data &&
          commitQuery.data.map((commit, idx) => {
            return (
              <div className="text-sm hover:bg-neutral-700  cursor-pointer w-full  border-b border-neutral-800">
                <div className="flex gap-1 mx-2">

                  <button
                    key={idx}
                    className=" w-full text-left  text-nowrap  select-text"
                    onClick={() => handleOnCommitClick(commit.hash)}
                  >
                    {commit.subject}
                  </button>
                </div>
                <div className="flex gap-2 mx-2 text-xs text-neutral-400">
                  <p>{commit.author}</p>
                  <p>{commit.relativeDate}</p>
                  <button className="">
                    {commit.hash}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
