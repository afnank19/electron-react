import { useEffect } from "react";
import { useGitLogStore, useRepoStore } from "../state/repo-store";

export const Logs = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const gitLogs = useGitLogStore((s) => s.gitLogs);
  const resetLogs = useGitLogStore((s) => s.resetLogs);

  useEffect(() => {
    console.log("refreshed", gitLogs);
  }, [gitLogs]);

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    resetLogs();
  }, [repoPath]);

  return (
    <div className="border rounded-2xl border-neutral-800 min-h-82 max-h-82 overflow-auto">
      <h1 className="font-bold border-b p-2 border-neutral-800 flex justify-between items-center">
        <span>Logs</span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </h1>
      <div className="">
        {gitLogs.map((log) => {
          return (
            <div style={{ whiteSpace: "pre-wrap" }} className="font-mono text-sm px-2 m-1 border-l border-orange-500">
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
};
