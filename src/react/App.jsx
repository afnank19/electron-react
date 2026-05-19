import { useState } from "react";
import OpenRepoLayout from "./components/layouts/open-repo-layout";
import GitStatus from "./components/git-status";

const App = () => {
  return (
    <div className="">
      <OpenRepoLayout />
      <GitStatus />
    </div>
  );
};

export default App;
