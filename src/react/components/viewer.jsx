import { useEffect } from "react";
import { useRepoStore, useViewerStore } from "../state/repo-store";
import Convert from "ansi-to-html";
import DOMPurify from "dompurify";
import { escapeHtml } from "../utils/utils";

// THOUGHT: Another approach is instead of Html, to use json, and iterate
// will take a look if this turns into hassle
export const Viewer = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const fileDiff = useViewerStore((s) => s.fileDiff);
  const setFileDiff = useViewerStore((s) => s.setFileDiff);
  const viewerMode = useViewerStore((s) => s.viewerMode);
  const setCommitLog = useViewerStore((s) => s.setCommitLog);
  const commitLog = useViewerStore((s) => s.commitLog);

  const convert = new Convert();

  const fileDiffHtml = fileDiff ? convert.toHtml(escapeHtml(fileDiff)) : null;
  const cleanFileDiffHtml = fileDiffHtml
    ? DOMPurify.sanitize(fileDiffHtml)
    : null;

  const commitLogHtml = commitLog
    ? convert.toHtml(escapeHtml(commitLog))
    : null;

  // console.log(fileDiffHtml)

  // useEffect(() => {
  //   console.log("updated file diff", fileDiff)
  // }, [fileDiff])

  console.count("viewer refreshed");

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    setFileDiff("");
    setCommitLog("");
  }, [repoPath]);

  return (
    <div className="">
      {/* <p className="whitespace-pre font-mono text-sm">{fileDiff}</p>*/}
      <h1 className="font-bold border-b p-2 border-neutral-800">Viewer</h1>
      {viewerMode === "commit" ? (
        <>
          <p
            className="whitespace-pre overflow-x-auto font-mono text-sm p-2"
            dangerouslySetInnerHTML={{ __html: commitLogHtml }}
          ></p>
        </>
      ) : (
        <p
          className="whitespace-pre overflow-x-auto font-mono text-sm p-2"
          dangerouslySetInnerHTML={{ __html: cleanFileDiffHtml }}
        ></p>
      )}
    </div>
  );
};
