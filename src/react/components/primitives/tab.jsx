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
    <div className="flex items-center gap-2 px-1 justify-between border border-neutral-700 rounded-lg overflow-hidden hover:bg-neutral-800 cursor-pointer">
      <div className="flex items-center px-2 gap-2">
        {repoPath === repoName && (
          <span className="w-2 h-2 rounded-full bg-red-500" />
        )}
        <button className="cursor-pointer truncate max-w-[16ch]" onClick={handleClick}>
          {parsedName}
        </button>
      </div>

      <button
        className="hover:bg-neutral-700 h-full px-1 rounded text-sm font-bold font-mono cursor-pointer"
        onClick={() => handleCloseTab(tabId)}
      >
        ×
      </button>
    </div>
  );
};
