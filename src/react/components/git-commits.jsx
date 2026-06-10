import { useEffect, useState } from "react";
import { splitByNewLine } from "../utils/utils";
import { useAppStore, useGitLogStore, useRepoStore, useViewerStore } from "../state/repo-store";

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
    window.gitAPI.getCommitLog(repoPath, commitHash).then(setCommitLog);
  }

  return (
    <div className="text-white flex flex-col gap-4 m-2 border rounded-2xl border-neutral-700 py-1 px-2">
      <h1 className="font-bold">Commits</h1>

      <div className="flex gap-4">
        <input
          placeholder="eg. feat: update README.md"
          className="border border-neutral-700 rounded-lg px-2 text-sm flex-1"
          value={commitMsg}
          onChange={(e) => {
            setCommitMsg(e.target.value);
          }}
        ></input>
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
                className="text-sm w-full text-left font-mono bg-[#000000] text-nowrap hover:bg-yellow-500 hover:text-black cursor-pointer select-text"
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
