import { useMemo } from "react";
import { PatchDiff, Virtualizer } from "@pierre/diffs/react";
import { splitGitPatches } from "../../utils/git-utils";

type DiffViewerProps = {
  diff: string;
};

const theme = { dark: "github-dark-high-contrast", light: "github-dark-high-contrast" };

// There is a performance issue whrere extremely large diffs make the resizeable panels
// really laggy. Thinking of gating large diffs

export function DiffViewer({ diff }: DiffViewerProps) {
  if (!diff) {
    return <p className="p-8 text-center font-bold">¯\_(ツ)_/¯</p>;
  }

  const filePatches = useMemo(() => splitGitPatches(diff), [diff]);

  if (filePatches.length === 0) {
    return (
      <div className="w-full text-center m-8 font-black">
        ¯\_(ツ)_/¯
      </div>
    )
  }


  return (
    <Virtualizer className="p-2 flex flex-col gap-4 overflow-auto" contentClassName="flex flex-col gap-4">
      {filePatches.map((patch, i) => (
        <PatchDiff
          key={extractFileName(patch) ?? i}
          patch={patch}
          options={{
            diffStyle: "unified",
            theme,
          }}
          style={{
            '--diffs-font-family': 'Ioskeley Mono, monospace',
            '--diffs-font-size': '13px'
          } as React.CSSProperties}
        />
      ))}
    </Virtualizer>
  );
}

function extractFileName(patch: string): string | null {
  const match = patch.match(/^diff --git a\/(.+?) b\//m);
  return match?.[1] ?? null;
}
