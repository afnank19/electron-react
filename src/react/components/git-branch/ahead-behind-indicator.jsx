import { useEffect, useState } from "react";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";
import { useAheadBehindCount } from "../../hooks/use-changes";

export function AheadBehindIndicator({ repoPath }) {
  const query = useAheadBehindCount(repoPath);
  const [ahead, behind] = query.data ?? [];
  const [flashKey, setFlashKey] = useState(0);

  const hasChanges = ahead !== "0" || behind !== "0";

  useEffect(() => {
    if (hasChanges) {
      setFlashKey((key) => key + 1);
    }
  }, [hasChanges]);

  if (query.isLoading || query.isError || !ahead || ahead === "-1") {
    return null;
  }

  return (
    <div
      key={flashKey}
      className={`px-2 py-1 ${
        hasChanges
          ? "bg-[#ffae00] animate-flash-change"
          : "border-r border-neutral-800"
      }`}
    >
      <p
        className={`text-left text-xs ${
          hasChanges ? "text-neutral-950" : "text-neutral-400"
        }`}
      >
        Ahead / Behind
      </p>

      <div className={hasChanges ? "font-bold text-neutral-950" : ""}>
        <div className="flex gap-4">
          <p className="flex items-center">
            {ahead}
            <MoveUpIcon size={14} strokeWidth={2.5} />
          </p>

          <p className="flex items-center">
            {behind}
            <MoveDownIcon size={14} strokeWidth={2.5} />
          </p>
        </div>
      </div>
    </div>
  );
}
