import { useEffect, useState } from "react";
import { splitByNewLine } from "../utils/utils";
import { useAppStore, useRepoStore } from "../state/repo-store";

export const GitCommits = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh)


  const [commits, setCommits] = useState("");
  const parsedCommits = commits ? splitByNewLine(commits) : null;

  const [commitMsg, setCommitMsg] = useState("");

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    window.gitAPI.commits(repoPath).then(setCommits);
  }, [repoPath]);

  function handleOnCommit() {
    setCommitMsg("");
    window.gitAPI.commitChange(repoPath, commitMsg);
    window.gitAPI.commits(repoPath).then(setCommits);

    triggerRefresh();
  }

  return (
    <div className="text-white flex flex-col gap-4 m-4">
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
          className="font-bold text-xs border rounded-lg px-2  border-neutral-700 hover:bg-neutral-600"
          onClick={handleOnCommit}
        >
          Commit with message
        </button>
      </div>

      <div>
        {parsedCommits &&
          parsedCommits.map((commit, idx) => {
            return (
              <div id={idx} className="text-sm font-mono bg-[#0000ff]">
                {commit}
              </div>
            );
          })}
      </div>
    </div>
  );
};
