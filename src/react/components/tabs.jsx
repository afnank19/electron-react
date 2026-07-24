import { useEffect, useState } from "react";
import { useRepoStore, useTabStore } from "../state/repo-store";
import { Tab } from "./primitives/tab";
import { OpenRepo } from "./open-repo";
import { Plus } from "lucide-react";
import { useTabHotkeys } from "../hooks/use-tab-hotkeys";

const Tabs = () => {
  const tabs = useTabStore((state) => state.tabs);
  const removeTab = useTabStore((state) => state.removeTab);

  const repoPath = useRepoStore((state) => state.repoPath);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);

  useTabHotkeys();

  const [pathErr, setPathErr] = useState("");

  const handleCloseTab = (tabId) => {
    removeTab(tabId);
  };

  useEffect(() => {
    console.log("tabs", tabs);
    if (tabs.length > 0) {
      const latestOpenedTab = tabs[tabs.length - 1];

      console.log(latestOpenedTab);

      localStorage.setItem("repo-path", latestOpenedTab.repoPath);
      setRepoPath(latestOpenedTab.repoPath);
      window.app.setRepoPath(latestOpenedTab.repoPath);
    } else {
      console.log("no more tabs");
      localStorage.removeItem("repo-path");
      setRepoPath(null);
      window.app.setRepoPath(null);
    }
  }, [tabs]);

  return (
    <>
      <div className="flex items-center gap-1 px-2 py-1 select-none">
        <div className="mr-1 border-2 border-lime-200 px-1 py-0">
          <p className="font-bold text-lime-200">Circe</p>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab, idx) => {
            return (
              <div key={idx}>
                <Tab repoName={tab.repoPath} tabId={tab.id} handleCloseTab={handleCloseTab} />
              </div>
            );
          })}
        </div>
        <OpenRepo pathErr={pathErr} setPathErr={setPathErr}>
          <div className="rounded-lg p-1 hover:bg-neutral-600">
            <Plus size={18} />
          </div>
        </OpenRepo>
        {/* <div className="ml-auto pl-2">
          <OpenRepo pathErr={pathErr} setPathErr={setPathErr}/>
        </div>*/}
      </div>
    </>
  );
};

export default Tabs;
