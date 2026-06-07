import { useEffect, useState } from "react";
import { useGitLogStore, useRepoStore } from "../state/repo-store";
import { splitByNewLine } from "../utils/utils";

export const GitRemote = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  const [remotes, setRemotes] = useState("");
  const parsedRemotes = remotes ? splitByNewLine(remotes) : null;

  useEffect(() => {
    if (repoPath === null) {
      return;
    }

    window.gitAPI.getRemotes(repoPath).then(setRemotes)
  }, [repoPath])

  useEffect(() => {
    console.log(remotes)
  }, [remotes])

  return (
    <div className="border p-2">
      <div className="flex items-center gap-2">
        <p>Remote: </p>
        <select>
          {parsedRemotes && parsedRemotes.map((remote, idx) => {
            return (
              <option id={idx} className="bg-black" >{ remote }</option>
            )
          })}
        </select>
        <button className="font-bold text-xs border rounded-lg px-2  border-neutral-700 hover:bg-neutral-600">
          Push to Remote
        </button>
        <button className="font-bold text-xs border rounded-lg px-2  border-neutral-700 hover:bg-neutral-600">
          Pull from Remote
        </button>
      </div>
    </div>
  );
};
