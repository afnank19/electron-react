import { useState } from "react";
import OpenRepoLayout from "./components/layouts/open-repo-layout";
import GitStatus from "./components/git-status";
import GitBranch from "./components/git-branch";
import Tabs from "./components/tabs";
import { GitCommits } from "./components/git-commits";
import { useRepoStore } from "./state/repo-store";

const App = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  return (
    <div className="">
      <Tabs />
      <OpenRepoLayout />
      {repoPath !== null ?
        <>
          <GitStatus />
          <GitBranch />
          <GitCommits />
        </>
        :
        <div>
          <p>No repository opened</p>
        </div>
      }
    </div>
  );
};

export default App;
