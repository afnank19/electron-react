import { useEffect, useState } from "react";
import { OpenRepo } from "./components/open-repo";
import { useRepoStore } from "./state/repo-store";

const App = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const [status, setStatus] = useState("");
  
  useEffect(() => {
    if (repoPath == null ) { return; }

    window.gitAPI.status(repoPath).then(setStatus);
  }, [repoPath])

  return (
    <div className="">
      <OpenRepo />
      <p>Current git status: {status}</p>
    </div>
  );
};

export default App;
