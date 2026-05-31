import { useState } from "react";
import OpenRepoLayout from "./components/layouts/open-repo-layout";
import GitStatus from "./components/git-status";
import GitBranch from "./components/git-branch";
import Tabs from "./components/tabs";

const App = () => {
  return (
    <div className="">
      <Tabs />
      <OpenRepoLayout />
      <GitStatus />
      <GitBranch />
    </div>
  );
};

export default App;
