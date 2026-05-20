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
    return status.split("\n").slice(0, -1);
  }

  function handleStaging(currentItem) {
    const filePath = currentItem.split(" ").pop();
    console.log("staging ", filePath);

    window.gitAPI.stageFile(repoPath, filePath);
    window.gitAPI.status(repoPath).then(setStatus);
  }

  // useEffect(() => {
  //     function handleFocus() {
  //       console.log("window focused");

  //       // refresh git status here
  //       window.gitAPI.status(repoPath).then(setStatus);
  //     }

  //     window.addEventListener("focus", handleFocus);

  //     return () => {
  //       window.removeEventListener("focus", handleFocus);
  //     };
  //   }, []);


  // TODO: handle overflow so it looks good
  return (
    <>
      <div className="p-2 border rounded-3xl border-neutral-700 m-2 w-fit max-w-1/2">
        {parsedStatus &&
          parsedStatus.map((st, idx) => {
            return (
              <div className="flex gap-4 items-center mx-2 my-1">
                <button
                  className="font-bold text-xs border rounded-lg px-2 py-1 border-neutral-700 hover:bg-neutral-800"
                  onClick={() => {handleStaging(st)}}
                >
                  Stage
                </button>
                <p
                  key={idx}
                  style={{ whiteSpace: "pre-wrap" }}
                  className="font-mono text-sm"
                >
                  {idx === 0 ? "" + st : st}
                </p>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default GitStatus;
