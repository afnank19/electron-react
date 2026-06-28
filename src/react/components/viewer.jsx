import { useEffect } from "react";
import {
  VIEWER_MODE,
  useGitLogStore,
  useRepoStore,
  useViewerStore,
} from "../state/repo-store";
import Convert from "ansi-to-html";
import DOMPurify from "dompurify";
import { escapeHtml } from "../utils/utils";
import { Bot } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { ContentViewPane } from "./viewer/content-view-pane";
import { ViewerPanel } from "./viewer/viewer-panel";

export const Viewer = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const addLog = useGitLogStore((s) => s.addLog);

  const viewerMode = useViewerStore((s) => s.viewerMode);
  const setViewerMode = useViewerStore((s) => s.setViewerMode);
  const resetViewer = useViewerStore((s) => s.resetViewer);

  const fileDiff = useViewerStore((s) => s.fileDiff);
  const filePath = useViewerStore((s) => s.filePath);
  const setFileDiff = useViewerStore((s) => s.setFileDiff);

  const commitLog = useViewerStore((s) => s.commitLog);
  const commitHash = useViewerStore((s) => s.commitHash);
  const setCommitLog = useViewerStore((s) => s.setCommitLog);

  const setSummary = useViewerStore((s) => s.setSummary);

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

    resetViewer();
  }, [repoPath]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      addLog("CLANKER: Analyzing changes, writing a summary for you.");
      return window.ai.diffSummary(repoPath);
    },
    onSuccess: (data) => {
      console.log("successfully ran, summary generated", data);
      setSummary(data);
      setViewerMode(VIEWER_MODE.SUMMARY);
      addLog("CLANKER: Summary written successfully");
    },
    onError: (error) => {
      addLog("ERROR: Couldn't write summary. Check: " + error.message);
    },
  });

  // Current changes, goes through an agent that decides which files it has to explore.

  return (
    <div className="bg-[#111111]">
      {/* <p className="whitespace-pre font-mono text-sm">{fileDiff}</p>*/}
      <div className="font-bold border-b p-2 border-neutral-800 flex gap-2 justify-between">
        <h1 className="font-bold">Viewer</h1>
        <button
          onClick={() => {
            mutate();
          }}
          className="font-bold text-xs border rounded-lg px-2  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 flex gap-1 items-center"
        >
          <Bot size={16} />
          {!isPending ? "Summarize current changes" : "Clanking"}
        </button>
      </div>
      <div className="h-105 overflow-auto relative">
        <ViewerPanel />
        {/* {viewerMode === "commit" ? (
          commitLog != "" ? (
            <div className="relative">
              <p
                className="whitespace-pre font-mono text-sm p-2"
                dangerouslySetInnerHTML={{ __html: commitLogHtml }}
              ></p>
              <button className="font-bold text-xs border rounded-md px-2  border-teal-700 hover:bg-teal-700 absolute top-2 right-2">
                Summarize
              </button>
            </div>
          ) : (
            <p className="p-2 italic">Click on a file or commit to view</p>
          )
        ) : (
          <ContentViewPane html={cleanFileDiffHtml} />
        )}*/}
      </div>
    </div>
  );
};
