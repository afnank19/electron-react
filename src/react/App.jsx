import { useState } from "react";
import OpenRepoLayout from "./components/layouts/open-repo-layout";
import GitStatus from "./components/git-status";
import GitBranch from "./components/git-branch";
import Tabs from "./components/tabs";
import { GitCommits } from "./components/git-commits";
import { useRepoStore } from "./state/repo-store";
import { Viewer } from "./components/viewer";
import { Logs } from "./components/logs";
import { GitRemote } from "./components/git-remote";

const App = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  return (
    <div className="">
      <Tabs />
      <OpenRepoLayout />
      {repoPath !== null ?
        <div className="flex">
          <div className="flex-1 max-w-1/2">
            <GitStatus />
            <GitCommits />
            <GitBranch />
          </div>
          <div className="flex-1 max-w-1/2 h-full flex flex-col mr-2">
            <div className="flex flex-col gap-2">
              <GitRemote />
              <div className="flex flex-col gap-2">
                <div className="overflow-auto border rounded-2xl border-neutral-800 min-h-115 max-h-115">
                  <Viewer/>
                </div>
                <Logs />
              </div>
            </div>
          </div>
        </div>
        :
        <div>
          <p>No repository opened</p>
        </div>
      }
    </div>
  );
};

export default App;
