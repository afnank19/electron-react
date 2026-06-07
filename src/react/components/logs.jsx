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
    <div className="border p-2">
      <h1 className="font-bold">Logs</h1>
      <div>
        {gitLogs.map((log) => {
          return (
            <div style={{ whiteSpace: "pre" }} className="font-mono text-sm ">
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
};
