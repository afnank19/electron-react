import { useMemo } from "react";
import { useViewerStore } from "../../state/repo-store";
import { parseCommitDiff } from "../../utils/git-utils";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile } from "@git-diff-view/file";
import "@git-diff-view/react/styles/diff-view.css";

export const CommitDiffViewer = () => {
  const commitLog = useViewerStore((s) => s.commitLog);

  const files = useMemo(() => {
    if (!commitLog) return [];
    return parseCommitDiff(commitLog);
  }, [commitLog]);

  if (!commitLog) {
    return <p className="p-2 italic">Select a commit to view</p>;
  }

  return (
    <div className="p-2 flex flex-col gap-4">
      {files.map((f, i) => {
        const ext = f.fileName.split(".").pop() || "";
        const diffFile = generateDiffFile(
          f.fileName,
          f.oldContent,
          f.fileName,
          f.newContent,
          ext,
          ext
        );
        diffFile.initTheme("dark");
        diffFile.init();
        diffFile.buildUnifiedDiffLines();

        return (
          <div
            key={i}
            className="border border-neutral-800 rounded-lg overflow-hidden"
          >
            <div className="bg-neutral-900 px-3 py-1 text-xs font-mono border-b border-neutral-800">
              {f.fileName}
            </div>
            <DiffView
              diffFile={diffFile}
              diffViewMode={DiffModeEnum.Unified}
              diffViewTheme="dark"
              diffViewHighlight
            />
          </div>
        );
      })}
    </div>
  );
};
