import { useEffect } from "react";
import { useRepoStore, useViewerStore } from "../state/repo-store";

export const Viewer = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const fileDiff = useViewerStore((s) => s.fileDiff);
  const setFileDiff = useViewerStore((s) => s.setFileDiff);

  useEffect(() => {
    console.log("updated file diff", fileDiff)
  }, [fileDiff])

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    setFileDiff("");
  }, [repoPath]);

  return (
    <div className=" p-2">
      <p className="whitespace-pre font-mono text-sm">{ fileDiff }</p>
    </div>
  );
};
