import { useEffect } from "react";
import { useViewerStore } from "../state/repo-store";

export const Viewer = () => {
  const fileDiff = useViewerStore((s) => s.fileDiff);

  useEffect(() => {
    console.log("updated file diff", fileDiff)
  }, [fileDiff])

  return (
    <div className=" p-2">
      <p className="whitespace-pre font-mono text-sm">{ fileDiff }</p>
    </div>
  );
};
