import { useEffect } from "react";
import { useRepoStore, useTabStore } from "../../state/repo-store";
import { getFolderName } from "../../utils/utils";
import { X } from "lucide-react";

export const Tab = ({ repoName, tabId, handleCloseTab }) => {
  const parsedName = getFolderName(repoName);
  const repoPath = useRepoStore((state) => state.repoPath);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);

  // Sets the active repository to be this tab
  const handleClick = () => {
    console.log("switched to", repoName);
    localStorage.setItem("repo-path", repoName);
    setRepoPath(repoName);
    window.app.setRepoPath(repoName);
  };

  return (
    <div className={`flex items-center gap-2 px-1 border border-neutral-800 justify-between rounded-lg overflow-hidden cursor-pointer hover:bg-neutral-800 ${
        repoPath === repoName ? "bg-neutral-800  border-neutral-500" : ""
      }`}>
      <div className="flex items-center px-2 gap-2">
        {repoPath === repoName && (
          <span className="w-2 h-2 rounded-full bg-white" />
        )}
        <button
          className="cursor-pointer font-bold truncate max-w-[16ch]"
          onClick={handleClick}
        >
          /{parsedName}
        </button>
      </div>

      <button
        className="hover:bg-neutral-700 h-full px-1 rounded text-sm font-bold font-mono cursor-pointer"
        onClick={() => handleCloseTab(tabId)}
      >
        <X size={16} />
      </button>
    </div>
  );
};
