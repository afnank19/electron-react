import React, { useState } from "react";
import { useRepoStore } from "../state/repo-store";

export const OpenRepo = () => {
  const setRepoPath = useRepoStore((state) => state.setRepoPath);
  const repoPath = useRepoStore((state) => state.repoPath);

  const [pathErr, setPathErr ] = useState("");
  // could move to a button component, but we'll see as the complexity increases
  const handleClick = async () => {
    // TODO: this path definitely needs to be processed
    // -> check if it is a git repo
    // -> work towards parent git folder
    const path = await window.repoAPI.openRepo();

    if (!path) return;

    if (path.error) {
        console.error('ERROR: not a git repo');
        setPathErr("INFO: Selected directory was not a git repo");
        return;
    } else {
        setPathErr("");
    }

    console.log(path);
    localStorage.setItem("repo-path", path);
    setRepoPath(path);
  };

  return (
    <div className="text-white">
        <div className="flex gap-4 items-center justify-between m-2">
            <p className="text-neutral-300">{"Active Repository: " + repoPath}</p>
        <button
            className="font-bold text-sm border rounded-xl px-4 py-2 m-2 border-neutral-700 hover:bg-neutral-800"
            onClick={handleClick}
        >
            {" "}
            OPEN REPOSITORY
        </button>

        </div>
      <p className="text-red-400">{pathErr}</p>
    </div>
  );
};
