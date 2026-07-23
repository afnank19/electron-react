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
    <div className="h-full overflow-auto border border-neutral-800">
      <h1 className="flex items-center justify-between border-b border-neutral-800 p-2 font-bold">
        <span>Logs</span>
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
      </h1>
      <div className="">
        {gitLogs.map((log) => {
          return (
            <div
              style={{ whiteSpace: "pre-wrap" }}
              className="m-1 border-l border-orange-500 px-2 font-mono text-sm"
            >
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
};
