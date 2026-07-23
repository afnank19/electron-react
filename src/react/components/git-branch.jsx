import { useEffect, useState } from "react";
import { useAppStore, useGitLogStore, useRepoStore } from "../state/repo-store";
import { splitByNewLine } from "../utils/utils";
import { GitBranchIcon } from "lucide-react";

const GitBranch = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);
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

    window.gitAPI
      .switchBranch(repoPath, branch)
      .then(addLog)
      .catch((error) => {
        addLog(error.message);
      });
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
    <div className="m-2 flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-[#111111] py-1">
      {/* <p>{test }</p>*/}
      <div className="flex flex-col gap-2 border-b border-neutral-800 px-2 pb-2">
        <div className="font-bold">Branch Management</div>
        <div className="text-sm font-bold">Currently on: {activeBranch}</div>

        <div className="flex gap-4">
          <input
            placeholder="Branch name"
            className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2 text-sm"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
          ></input>
          <button
            onClick={handleNewBranchCreationClick}
            className="flex items-center gap-1 rounded-lg border border-orange-600 bg-orange-700 px-2 text-xs font-bold shadow-xl hover:border-orange-500 hover:bg-orange-600"
          >
            <GitBranchIcon size={16} />
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
                className="group relative my-0.5 flex items-center justify-between gap-4 px-2 hover:bg-neutral-800"
              >
                <p className="text-sm">- {branch}</p>
                <button
                  // className="font-bold text-xs border rounded-md px-2 border-neutral-700 hover:bg-neutral-600 hidden group-hover:block"
                  className="rounded-md border border-neutral-700 bg-neutral-800 px-2 text-xs font-bold hover:border-neutral-600 hover:bg-neutral-700"
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
