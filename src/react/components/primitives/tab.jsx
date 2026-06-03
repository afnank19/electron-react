import { useEffect } from "react";
import { useRepoStore, useTabStore } from "../../state/repo-store";
import { getFolderName } from "../../utils/utils";

export const Tab = ({ repoName, tabId, handleCloseTab }) => {
  const parsedName = getFolderName(repoName);
  const repoPath = useRepoStore((state) => state.repoPath);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);

  // Sets the active repository to be this tab
  const handleClick = () => {
    console.log("switched to", repoName);
    localStorage.setItem("repo-path", repoName);
    setRepoPath(repoName);
  };

  return (
    <div className="flex items-center justify-between border border-neutral-700 rounded-xl text-nowrap overflow-hidden">
      <p className="text-red-500 text-lg ">
        {repoPath === repoName ? "+" : null}
      </p>
      <button className=" px-2 py-1 hover:bg-blue-800" onClick={handleClick}>
        {parsedName}
      </button>
      <button
        className="hover:bg-neutral-700 bg-neutral-800 px-2 rounded text-xs font-bold font-mono"
        onClick={() => handleCloseTab(tabId)}
      >
        X
      </button>
    </div>
  );
};
