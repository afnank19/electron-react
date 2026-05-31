import { useRepoStore } from "../state/repo-store";

const Tabs = () => {
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
    <div className="p-4 flex gap-4">
      <button onClick={handleTab1} className="hover:bg-gray-600 border">app-test-repo</button>
      <button onClick={handleTab2} className="hover:bg-gray-600 border">my-app</button>
    </div>
  );
};

export default Tabs;
