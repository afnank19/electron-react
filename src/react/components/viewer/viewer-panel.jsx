import Convert from "ansi-to-html";
import { VIEWER_MODE, useViewerStore } from "../../state/repo-store";
import { escapeHtml } from "../../utils/utils";
import DOMPurify from "dompurify";
import { ContentViewPane } from "./content-view-pane";
import Markdown from "react-markdown";


export const ViewerPanel = () => {
  const viewerMode = useViewerStore((s) => s.viewerMode);

  const fileDiff = useViewerStore((s) => s.fileDiff);
  const filePath = useViewerStore((s) => s.filePath);
  const setFileDiff = useViewerStore((s) => s.setFileDiff);

  const commitLog = useViewerStore((s) => s.commitLog);
  const commitHash = useViewerStore((s) => s.commitHash);
  const setCommitLog = useViewerStore((s) => s.setCommitLog);

  const summary = useViewerStore((s) => s.summary);

  const convert = new Convert();

  const fileDiffHtml = fileDiff ? convert.toHtml(escapeHtml(fileDiff)) : null;
  const cleanFileDiffHtml = fileDiffHtml
    ? DOMPurify.sanitize(fileDiffHtml)
    : null;

  const commitLogHtml = commitLog
    ? convert.toHtml(escapeHtml(commitLog))
    : null;

  switch (viewerMode) {
    case VIEWER_MODE.NONE: {
      return (
        <div className="text-center italic p-4">Click on a changed file or commit to view</div>
      )
    }
    case VIEWER_MODE.COMMIT: {
      return (
        <ContentViewPane html={commitLogHtml} />
      )
    }
    case VIEWER_MODE.FILE: {
      return (
        <ContentViewPane html={cleanFileDiffHtml} />
      )
    }
    case VIEWER_MODE.SUMMARY: {
      return (
        <div className="text-sm p-2">
          <Markdown>{summary}</Markdown>
        </div>
      )
    }
    default: {
      return (
        <div className="text-center italic">Nothing to show. Click on a changed file or commit to view</div>
      )
    }
  }
}
