import { useEffect } from "react";
import { useRepoStore, useViewerStore } from "../state/repo-store";
import Convert from "ansi-to-html";
import DOMPurify from 'dompurify';
import { escapeHtml } from "../utils/utils";

// THOUGHT: Another approach is instead of Html, to use json, and iterate
// will take a look if this turns into hassle
export const Viewer = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const fileDiff = useViewerStore((s) => s.fileDiff);
  const setFileDiff = useViewerStore((s) => s.setFileDiff);

  const convert = new Convert();

  const fileDiffHtml = fileDiff ? convert.toHtml(escapeHtml(fileDiff)) : null;
  const cleanFileDiffHtml = fileDiffHtml ? DOMPurify.sanitize(fileDiffHtml) : null;
  console.log(fileDiffHtml)

  // useEffect(() => {
  //   console.log("updated file diff", fileDiff)
  // }, [fileDiff])

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    setFileDiff("");
  }, [repoPath]);

  return (
    <div className=" p-2">
      {/* <p className="whitespace-pre font-mono text-sm">{fileDiff}</p>*/}
      <p className="whitespace-pre overflow-x-auto font-mono text-sm" dangerouslySetInnerHTML={{ __html: cleanFileDiffHtml }}></p>
    </div>
  );
};
