import React, { useEffect, useState } from "react";
import { useRepoStore } from "../state/repo-store";

const GitStatus = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  const [status, setStatus] = useState("");

  const parsedStatus = status ? processStatus(status) : null;

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    window.gitAPI.status(repoPath).then(setStatus);
    console.log(status);
    const splitStatusL = status.split("\n");
    console.log("split", splitStatusL);
    console.log("split", splitStatusL[0]);
  }, [repoPath]);

  function processStatus(status) {
    return status.split("\n");
  }

  return (
    <>
      <div>
        {parsedStatus && parsedStatus.map((st, idx) => {
          return <p style={{ whiteSpace: "pre-wrap" }} className="font-mono">{st}</p>
        })}
      </div>
    </>
  );
};

export default GitStatus;
