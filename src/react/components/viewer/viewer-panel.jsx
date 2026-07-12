import Convert from "ansi-to-html";
import { VIEWER_MODE, useViewerStore } from "../../state/repo-store";
import { escapeHtml } from "../../utils/utils";
import DOMPurify from "dompurify";
import { ContentViewPane } from "./content-view-pane";
import { CommitDiffViewer } from "./commit-diff-viewer";
import Markdown from "react-markdown";


export const ViewerPanel = () => {
  const viewerMode = useViewerStore((s) => s.viewerMode);

  const fileDiff = useViewerStore((s) => s.fileDiff);
  const setFileDiff = useViewerStore((s) => s.setFileDiff);

  const summary = useViewerStore((s) => s.summary);

  const convert = new Convert();

  const fileDiffHtml = fileDiff ? convert.toHtml(escapeHtml(fileDiff)) : null;
  const cleanFileDiffHtml = fileDiffHtml
    ? DOMPurify.sanitize(fileDiffHtml)
    : null;

  switch (viewerMode) {
    case VIEWER_MODE.NONE: {
      return (
        <div className="text-center italic p-4">Click on a changed file or commit to view</div>
      )
    }
    case VIEWER_MODE.COMMIT: {
      return (
        <CommitDiffViewer />
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
