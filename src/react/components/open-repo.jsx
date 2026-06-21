import React, { useEffect, useState } from "react";
import { useRepoStore, useTabStore } from "../state/repo-store";
import { Plus, PlusSquare } from "lucide-react";

export const OpenRepo = ({ pathErr, setPathErr}) => {
  const setRepoPath = useRepoStore((state) => state.setRepoPath);
  const repoPath = useRepoStore((state) => state.repoPath);

  const addTab = useTabStore((state) => state.addTab);

  // const [pathErr, setPathErr] = useState("");

  const handleClick = async () => {
    const path = await window.repoAPI.openRepo();

    if (!path) return;

    if (path.error) {
      console.error("ERROR: not a git repo");
      setPathErr("Selected directory was not a git repo");
      return;
    } else {
      setPathErr("");
    }

    console.log(path);
    localStorage.setItem("repo-path", path);
    setRepoPath(path);
    addTab({
      id: crypto.randomUUID(),
      repoPath: path
    })
  };

  useEffect(() => {
    const previousRepoPath = localStorage.getItem("repo-path");

    setRepoPath(previousRepoPath);
  }, []);

  return (
    <div className="text-white text-nowrap">
      <button
        className="cursor-pointer font-bold text-xs rounded-lg p-1 my-1  hover:bg-neutral-600"
        onClick={handleClick}
      >
        <Plus size={20} />
      </button>
    </div>
  );
};
