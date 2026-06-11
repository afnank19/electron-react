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
    <div className="border rounded-2xl border-neutral-800 min-h-78 max-h-78 overflow-auto">
      <h1 className="font-bold border-b p-2 border-neutral-800">Logs</h1>
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
