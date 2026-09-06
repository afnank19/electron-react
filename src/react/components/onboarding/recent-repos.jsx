import { FolderOpen, Folders, Info } from "lucide-react";
import { useRepoStore, useTabStore } from "../../state/repo-store";
import { getFolderName } from "../../utils/utils";

export const RecentRepos = () => {
  const recentTabs = useTabStore((s) => s.recentTabs);
  const clearRecents = useTabStore((s) => s.clearRecents);

  const setRepoPath = useRepoStore((state) => state.setRepoPath);

  const addTab = useTabStore((state) => state.addTab);

  // const [pathErr, setPathErr] = useState("");

  const handleRecentTabClick = (path) => {
    console.log(path);
    localStorage.setItem("repo-path", path);
    setRepoPath(path);
    addTab({
      id: crypto.randomUUID(),
      repoPath: path,
    });
  };

  if (recentTabs.length === 0) {
    return (
      <div className="my-4 flex items-center justify-between gap-1 rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
        <div className="mx-1 flex items-center gap-2">
          <FolderOpen size={20} />
          <p>Your recent repositories will be shown here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="m-2 flex items-center justify-between">
        <p className="text-lg font-bold">Recent</p>
        <button
          onClick={() => {
            clearRecents();
          }}
          className="rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs font-bold hover:border-neutral-600 hover:bg-neutral-700"
        >
          Clear Recents
        </button>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
        {recentTabs.map((recentTab) => {
          return (
            <button
              key={recentTab.repoPath}
              onClick={() => {
                handleRecentTabClick(recentTab.repoPath);
              }}
              className="my-1.5 flex w-full items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-2 text-left hover:border-neutral-300 hover:bg-neutral-100"
            >
              <div className="h-1 w-1 rounded bg-zinc-400" />
              {recentTab.repoPath}
            </button>
          );
        })}
      </div>
    </div>
  );
};
