import { useEffect } from "react";
import { useRepoStore, useTabStore } from "../../state/repo-store";
import { getFolderName } from "../../utils/utils";
import { X } from "lucide-react";
import { useQueryInvalidation } from "../../queries/use-query-invalidation";

export const Tab = ({ repoName, tabId, handleCloseTab }) => {
  const parsedName = getFolderName(repoName);
  const repoPath = useRepoStore((state) => state.repoPath);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);

  const { invalidateAll } = useQueryInvalidation();

  // Sets the active repository to be this tab
  const handleClick = () => {
    console.log("switched to", repoName);
    localStorage.setItem("repo-path", repoName);
    setRepoPath(repoName);
    window.app.setRepoPath(repoName);
    invalidateAll(repoName);
  };

  return (
    <div
      className={`flex cursor-pointer items-center justify-between gap-2 overflow-hidden border border-neutral-800 px-1 hover:bg-neutral-800 ${
        repoPath === repoName ? "border-neutral-500 bg-neutral-800" : ""
      }`}
    >
      <div className="flex items-center gap-2 px-2">
        {repoPath === repoName && <span className="h-2 w-2 rounded-full bg-white" />}
        <button className="max-w-[16ch] cursor-pointer truncate font-bold" onClick={handleClick}>
          {parsedName}
        </button>
      </div>

      <button
        className="h-full cursor-pointer rounded px-1 font-mono text-sm font-bold hover:bg-neutral-700"
        onClick={() => handleCloseTab(tabId)}
      >
        <X size={16} />
      </button>
    </div>
  );
};
