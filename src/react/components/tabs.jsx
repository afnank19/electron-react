import { useEffect, useState } from "react";
import { useRepoStore, useTabStore } from "../state/repo-store";
import { Tab } from "./primitives/tab";
import { OpenRepo } from "./open-repo";
import { Plus } from "lucide-react";

const Tabs = () => {
  const tabs = useTabStore((state) => state.tabs);
  const removeTab = useTabStore((state) => state.removeTab);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);

  const [pathErr, setPathErr] = useState("");


  const handleTab1 = () => {
    const path = "/home/afnan/Desktop/dev/gitsage-gui/app-test-repo";
    console.log("hand coded");
    localStorage.setItem("repo-path", path);
    setRepoPath(path);
  };

  const handleTab2 = () => {
    console.log("ai coded");
    const path = "/home/afnan/Desktop/dev/gitsage-gui/my-app";
    localStorage.setItem("repo-path", path);
    setRepoPath(path);
  };

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
    } else {
      console.log("no more tabs");
      localStorage.removeItem("repo-path");
      setRepoPath(null);
    }
  }, [tabs]);

  return (
    <>
      <div className="px-2 py-1 items-center flex gap-1 select-none">
        <div className="border-2 border-lime-200 px-1 py-0 mr-1">
          <p className="font-bold font-mono text-lime-200">GS</p>
        </div>
        {/* <button onClick={handleTab1} className="hover:bg-gray-600 border">app-test-repo</button>
        <button onClick={handleTab2} className="hover:bg-gray-600 border">my-app</button>*/}
        <div className="overflow-x-auto flex gap-1">
          {tabs.map((tab, idx) => {
            return (
              <div key={idx}>
                <Tab
                  repoName={tab.repoPath}
                  tabId={tab.id}
                  handleCloseTab={handleCloseTab}
                />
              </div>
            );
          })}
        </div>
        <div>
          <OpenRepo pathErr={pathErr} setPathErr={setPathErr}/>
        </div>
        {/* <div className="ml-auto pl-2">
          <OpenRepo pathErr={pathErr} setPathErr={setPathErr}/>
        </div>*/}
      </div>
    </>
  );
};

export default Tabs;
