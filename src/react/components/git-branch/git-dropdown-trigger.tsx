import { useQuery } from "@tanstack/react-query";
import { useRepoStore } from "../../state/repo-store";
import { getActiveBranch } from "../../api/git-api/git-branch-api";
import { ChevronDown } from "lucide-react";

export function GitBranchDropdownTrigger() {
  const repoPath = useRepoStore((state) => state.repoPath);

  const { data: activeBranch = "", isLoading: isActiveBranchLoading } = useQuery<string>({
    queryKey: ["activeBranch", repoPath],
    queryFn: () => {
      return getActiveBranch(repoPath);
    },
  });

  return (
    <div>
      {isActiveBranchLoading ? null : (
        <div>
          <p className="text-left text-xs text-neutral-400">Current Branch</p>
          <div className="flex items-center gap-2 text-sm">
            <p className="font-bold">{activeBranch}</p>
            <ChevronDown size={12} />
          </div>
        </div>
      )}
    </div>
  );
}
