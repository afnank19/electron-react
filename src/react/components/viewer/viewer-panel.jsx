import Convert from "ansi-to-html";
import { VIEWER_MODE, useViewerStore } from "../../state/repo-store";
import { escapeHtml } from "../../utils/utils";
import DOMPurify from "dompurify";
import { ContentViewPane } from "./content-view-pane";
import Markdown from "react-markdown";
import { DiffViewer } from "./diff-viewer";

export const ViewerPanel = () => {
  const viewerMode = useViewerStore((s) => s.viewerMode);

  const commitLog = useViewerStore((s) => s.commitLog);

  const fileDiff = useViewerStore((s) => s.fileDiff);
  const setFileDiff = useViewerStore((s) => s.setFileDiff);

  const summary = useViewerStore((s) => s.summary);

  const convert = new Convert();

  const fileDiffHtml = fileDiff ? convert.toHtml(escapeHtml(fileDiff)) : null;
  const cleanFileDiffHtml = fileDiffHtml ? DOMPurify.sanitize(fileDiffHtml) : null;

  const commitLogHtml = commitLog ? convert.toHtml(escapeHtml(commitLog)) : null;

  switch (viewerMode) {
    case VIEWER_MODE.NONE: {
      return (
        <div className="p-4 text-center italic">Click on a changed file or commit to view</div>
      );
    }
    case VIEWER_MODE.COMMIT: {
      return <DiffViewer diff={commitLog} />;
    }
    case VIEWER_MODE.FILE: {
      return <DiffViewer diff={fileDiff} />;
    }
    case VIEWER_MODE.SUMMARY: {
      return (
        <div className="p-2 text-sm">
          <Markdown>{summary}</Markdown>
        </div>
      );
    }
    default: {
      return (
        <div className="text-center italic">
          Nothing to show. Click on a changed file or commit to view
        </div>
      );
    }
  }
};
