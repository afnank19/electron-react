import { useEffect, useState } from "react";
import { splitByNewLine } from "../utils/utils";
import { useAppStore, useGitLogStore, useRepoStore, useViewerStore } from "../state/repo-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateCommitMessage } from "./services/llm/service";

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
    window.gitAPI.commitChange(repoPath, commitMsg).then(addLog).catch((err) => {addLog(err.message)});
    window.gitAPI.commits(repoPath).then(setCommits);

    triggerRefresh();
  }

  function handleOnCommitClick(commitItem) {
    console.log("clicking the commit", commitItem);
    const commitItemSplit = commitItem.split(" ");
    const commitHash = commitItemSplit[0];

    setViewerMode("commit");
    window.gitAPI.getCommitLog(repoPath, commitHash).then((res) => {
      setCommitLog(res, commitHash);
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const headDiff = await window.gitAPI.getHeadDiff(repoPath);
      console.log("head diff", headDiff);
      // return generateCommitMessage(headDiff);
      return window.ai.commitMsg(headDiff);
    },
    onSuccess: (data) => {
      console.log("succeeded in generation", data)
      setCommitMsg(data);
      addLog("INFO: Generated commit message for current changes");
    },
    onError: (error) => {
      console.error("failed generation", error)
      addLog("FATAL: Failed to generate commit message through LLM: " + error.message);
    }
  });

  return (
    <div className="text-white flex flex-col gap-2 m-2 border rounded-2xl border-neutral-800 py-1">
      <h1 className="font-bold px-2">Commits</h1>

      <div className="flex gap-2 border-b border-neutral-700 pb-4 px-2">
        <textarea
          placeholder="eg. feat: update README.md"
          className="border border-neutral-700 rounded-lg px-2 text-sm flex-1 resize-none overflow-hidden"
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
        <button
          className="font-bold text-xs border rounded-lg px-2  border-neutral-700 hover:bg-neutral-700"
          onClick={() => { mutate(); }}
        >
          {isPending ? "Generating" : "Generate with LLM"}
        </button>
        <button
          className="font-bold text-xs border rounded-lg px-2  border-blue-600 hover:bg-blue-600"
          onClick={handleOnCommit}
        >
          Commit with message
        </button>
      </div>

      <div className="overflow-auto min-h-52 max-h-52">
        {parsedCommits &&
          parsedCommits.map((commit, idx) => {
            return (
              <button
                key={idx}
                className="text-sm px-2 w-full text-left font-mono  text-nowrap hover:bg-yellow-500 hover:text-black cursor-pointer select-text border-b border-neutral-800"
                onClick={() => handleOnCommitClick(commit)}
              >
                {commit}
              </button>
            );
          })}
      </div>
    </div>
  );
};
