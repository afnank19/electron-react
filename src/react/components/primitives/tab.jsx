import { useEffect } from "react";
import { useRepoStore, useTabStore } from "../../state/repo-store";
import { getFolderName } from "../../utils/utils";

export const Tab = ({ repoName, tabId }) => {
  const parsedName = getFolderName(repoName);
  const repoPath = useRepoStore((state) => state.repoPath);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);

  const removeTab = useTabStore((state) => state.removeTab);
  const tabs = useTabStore((state) => state.tabs);

  // Sets the active repository to be this tab
  const handleClick = () => {
    console.log("switched to", repoName);
    localStorage.setItem("repo-path", repoName);
    setRepoPath(repoName);
  };

  const handleCloseTab = () => {
    removeTab(tabId);
  };

  useEffect(() => {
    console.log("tabs", tabs)
    if (tabs.length > 0) {
      const latestOpenedTab = tabs[tabs.length - 1];

      console.log(latestOpenedTab)

      localStorage.setItem("repo-path", latestOpenedTab.repoPath);
      setRepoPath(latestOpenedTab.repoPath);
    } else {
      console.log("no more tabs")
      localStorage.removeItem("repo-path");
      setRepoPath(null);
    }
  }, [tabs])

  return (
    <div className="flex items-center justify-between border border-neutral-700 rounded-lg">
      <p className="text-red-500 text-xl py-1">
        {repoPath === repoName ? "*" : null}
      </p>
      <button className=" px-2 py-1 hover:bg-blue-800" onClick={handleClick}>
        {parsedName}
      </button>
      <button
        className="hover:bg-neutral-700 bg-neutral-800 px-2 rounded text-xs"
        onClick={handleCloseTab}
      >
        X
      </button>
    </div>
  );
};
