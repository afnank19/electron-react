import { useEffect } from "react";
import { useRepoStore, useViewerStore } from "../state/repo-store";
import Convert from "ansi-to-html";
import DOMPurify from "dompurify";
import { escapeHtml } from "../utils/utils";
import { Bot } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export const Viewer = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  const fileDiff = useViewerStore((s) => s.fileDiff);
  const filePath = useViewerStore((s) => s.filePath);
  const setFileDiff = useViewerStore((s) => s.setFileDiff);

  const viewerMode = useViewerStore((s) => s.viewerMode);

  const commitLog = useViewerStore((s) => s.commitLog);
  const commitHash = useViewerStore((s) => s.commitHash);
  const setCommitLog = useViewerStore((s) => s.setCommitLog);

  const convert = new Convert();

  const fileDiffHtml = fileDiff ? convert.toHtml(escapeHtml(fileDiff)) : null;
  const cleanFileDiffHtml = fileDiffHtml
    ? DOMPurify.sanitize(fileDiffHtml)
    : null;

  const commitLogHtml = commitLog
    ? convert.toHtml(escapeHtml(commitLog))
    : null;

  console.count("viewer refreshed");

  // console.log("viewer items",fileDiff, fileDiffHtml, commitLog, commitLogHtml);

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    setFileDiff("");
    setCommitLog("");
  }, [repoPath]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return window.ai.diffSummary(repoPath);
    },
    onSuccess: (data) => {
      console.log("successfully ran, numstat=", data)
    },
    onError: (error) => {
      console.error("couldn't run", error);
    }
  })

  // Current changes, goes through an agent that decides which files it has to explore.

  return (
    <div className="">
      {/* <p className="whitespace-pre font-mono text-sm">{fileDiff}</p>*/}
      <div className="font-bold border-b p-2 border-neutral-800 flex gap-2 justify-between">
        <h1 className="font-bold">Diff Viewer</h1>
        <button onClick={() => { mutate(); }} className="font-bold text-xs border rounded-lg px-2  border-neutral-700 hover:bg-neutral-700 flex gap-1 items-center">
          <Bot size={16} />
          {!isPending ? "Summarize current changes" : "Beep Boop"}
        </button>
      </div>
      <div className="h-100 overflow-auto relative">
        {viewerMode === "commit" ? (
          commitLog != "" ? (
            <div className="relative">
              <p
                className="whitespace-pre font-mono text-sm p-2"
                dangerouslySetInnerHTML={{ __html: commitLogHtml }}
              ></p>
              <button className="font-bold text-xs border rounded-md px-2  border-teal-700 hover:bg-teal-700 sticky top-2 right-2">
                Summarize
              </button>
            </div>
          ) : (
            <p className="p-2 italic">Select an file or commit to view</p>
          )
        ) : (
          <div className="relative">
            <p
              className="whitespace-pre font-mono text-sm p-2"
              dangerouslySetInnerHTML={{ __html: cleanFileDiffHtml }}
            ></p>
            <button className="font-bold text-xs border rounded-md px-2  border-teal-700 hover:bg-teal-700 absolute top-2 right-2">
              Summarize
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
