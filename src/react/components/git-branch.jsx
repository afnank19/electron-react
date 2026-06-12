import { useEffect, useState } from "react";
import { useAppStore, useGitLogStore, useRepoStore } from "../state/repo-store";
import { splitByNewLine } from "../utils/utils";

const GitBranch = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh)
  const addLog = useGitLogStore((s) => s.addLog);

  const [branches, setBranches] = useState("");
  const parsedBranches = branches ? splitByNewLine(branches) : null;
  const [activeBranch, setActiveBranch] = useState("");

  const [newBranchName, setNewBranchName] = useState("");

  const [test, setTest] = useState("");

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    window.gitAPI.branches(repoPath).then(setBranches);
    window.gitAPI.branch(repoPath).then(setActiveBranch);
  }, [repoPath]);

  function handleBranchSwitch(branch) {
    console.log("switching branch to ", branch);
    setNewBranchName("");

    window.gitAPI.switchBranch(repoPath, branch).then(addLog).catch((error) => { addLog(error.message)});
    window.gitAPI.branch(repoPath).then(setActiveBranch);
    triggerRefresh();
  }

  function handleNewBranchCreationClick() {
    setNewBranchName("");

    if (newBranchName === "") {
      return;
    }

    window.gitAPI.createBranch(repoPath, newBranchName).then(addLog);
    window.gitAPI.branches(repoPath).then(setBranches);
    window.gitAPI.branch(repoPath).then(setActiveBranch);
  }

  // TODO: try to move local state to the global state in zustand, so that
  // updating one, can lead to the others refreshing themselves with new data
  // kind of like an event driven system?
  return (
    <div className="flex flex-col gap-2 py-1 border rounded-2xl border-neutral-800 m-2">
      {/* <p>{test }</p>*/}
      <div className="border-b border-neutral-700 pb-2 px-2 flex flex-col gap-2">
        <div className="font-bold">Branch Management</div>
        <div className="font-bold text-sm">Currently On: { activeBranch }</div>

        <div className="flex gap-4">
          <input
            placeholder="Branch name"
            className="border border-neutral-700 rounded-lg px-2 text-sm flex-1"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
          ></input>
          <button onClick={handleNewBranchCreationClick} className="font-bold text-xs border rounded-lg px-2  border-blue-600 hover:bg-blue-600">
            Create and Switch to Branch
          </button>
        </div>
      </div>

      <div className="max-h-40 min-h-40 overflow-auto">
        {parsedBranches &&
          parsedBranches.map((branch, idx) => {
            return (
              <div
                key={idx}
                className="flex gap-4 items-center group justify-between relative hover:bg-neutral-800 px-2"
              >
                <p className=" text-sm">- {branch}</p>
                <button
                  // className="font-bold text-xs border rounded-md px-2 border-neutral-700 hover:bg-neutral-600 hidden group-hover:block"
                  className="font-bold text-xs border rounded-md px-2 border-neutral-700 hover:bg-neutral-600"
                  onClick={() => {
                    handleBranchSwitch(branch);
                  }}
                >
                  Checkout
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GitBranch;
