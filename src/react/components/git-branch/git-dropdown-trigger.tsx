import { useQuery } from "@tanstack/react-query";
import { useRepoStore } from "../../state/repo-store";
import { getActiveBranch } from "../../api/git-api/git-branch-api";
import { ChevronDown } from "lucide-react";

export function GitBranchDropdownTrigger() {
  const repoPath = useRepoStore((state) => state.repoPath);

  const { data: activeBranch = "", isLoading: isActiveBranchLoading } =
    useQuery<string>({
      queryKey: ["activeBranch", repoPath],
      queryFn: () => {
        return getActiveBranch(repoPath);
      },
    });

  return (
    <div>
      {isActiveBranchLoading ? null : (
        <div className="flex gap-2 items-center">
          <p>{activeBranch + " | "}</p>
          <ChevronDown size={12} />
        </div>
      )}
    </div>
  );
}
