import { useRepoStore, useTabStore } from "../state/repo-store";
import { Tab } from "./primitives/tab";

const Tabs = () => {
  const tabs = useTabStore((state) => state.tabs);

  const setRepoPath = useRepoStore((state) => state.setRepoPath);

  const handleTab1 = () => {
    const path = "/home/afnan/Desktop/dev/gitsage-gui/app-test-repo"
    console.log("hand coded");
    localStorage.setItem("repo-path", path);
    setRepoPath(path);
  }

  const handleTab2 = () => {
    console.log("ai coded");
    const path = "/home/afnan/Desktop/dev/gitsage-gui/my-app"
    localStorage.setItem("repo-path", path);
    setRepoPath(path);
  }

  return (
    <>
      <div className="p-4 items-center flex gap-1 border-b border-neutral-700">
        <p className="font-bold mr-4">GitSage</p>
        <button onClick={handleTab1} className="hover:bg-gray-600 border">app-test-repo</button>
        <button onClick={handleTab2} className="hover:bg-gray-600 border">my-app</button>

        {/* <Tab repoName={"/gitsage"} />
        <Tab repoName={"/gitsage"} />
        <Tab repoName={"/gitsage"} />*/}
        {tabs.map((tab, idx) => {
          return (
            <div key={idx}>
              <Tab repoName={tab.repoPath} tabId={tab.id} />
            </div>
          )
        })}
      </div>
      {/* {tabs.map((tab, idx) => {
        return (
          <div key={idx}>
            {tab.repoPath}
          </div>
        )
      })}*/}
    </>
  );
};

export default Tabs;
