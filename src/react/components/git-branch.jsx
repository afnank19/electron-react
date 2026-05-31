import { useEffect, useState } from "react";
import { useRepoStore } from "../state/repo-store";
import { splitByNewLine } from "../utils/utils";

const GitBranch = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  const [branches, setBranches] = useState("");
  const parsedBranches = branches ? splitByNewLine(branches) : null;
  const [activeBranch, setActiveBranch] = useState("");

  const [newBranchName, setNewBranchName] = useState("");

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    window.gitAPI.branches(repoPath).then(setBranches);
    window.gitAPI.branch(repoPath).then(setActiveBranch);
  }, [repoPath]);

  function handleBranchSwitch(branch) {
    console.log("switching branch to ", branch);
    window.gitAPI.switchBranch(repoPath, branch);
    window.gitAPI.branch(repoPath).then(setActiveBranch);
  }

  function handleNewBranchCreationClick() {
    console.log(newBranchName, 'creating')
    window.gitAPI.createBranch(repoPath, newBranchName);
    window.gitAPI.branches(repoPath).then(setBranches);
    window.gitAPI.branch(repoPath).then(setActiveBranch);
  }

  // TODO: try to move local state to the global state in zustand, so that
  // updating one, can lead to the others refreshing themselves with new data
  // kind of like an event driven system?
  return (
    <div className="m-3">
      <div className="text-purple-300">Active Branch = { activeBranch }</div>

      {parsedBranches &&
        parsedBranches.map((branch, idx) => {
          return (
            <div
              key={idx}
              className="flex gap-4 items-center group relative hover:bg-neutral-800"
            >
              <p className="py-1">{branch}</p>
              <button
                className="font-bold text-xs border rounded-lg px-2 py-1 border-neutral-700 hover:bg-neutral-600 hidden group-hover:block"
                onClick={() => {
                  handleBranchSwitch(branch);
                }}
              >
                Switch
              </button>
            </div>
          );
        })}
      <div className="flex gap-4">
        <input
          placeholder="Branch name"
          className="border border-neutral-700 rounded-lg px-2 text-sm"
          value={newBranchName}
          onChange={(e) => setNewBranchName(e.target.value)}
        ></input>
        <button onClick={handleNewBranchCreationClick} className="font-bold text-xs border rounded-lg px-2  border-neutral-700 hover:bg-neutral-600">
          Create and Switch to Branch
        </button>
      </div>
    </div>
  );
};

export default GitBranch;
