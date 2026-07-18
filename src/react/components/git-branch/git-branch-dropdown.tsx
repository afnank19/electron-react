import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLocalBranches, switchBranch, createAndSwitchToBranch } from "../../api/git-api/git-branch-api";
import { useRepoStore, useGitLogStore } from "../../state/repo-store";
import { useQueryInvalidation } from "../../queries/use-query-invalidation";
import { Plus } from "lucide-react";

type Item = {
  id: string;
  label: string;
};

type ItemDropdownProps = {
  trigger: React.ReactNode;
};

export function GitBranchDropdown({
  trigger,
}: ItemDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const repoPath = useRepoStore((state) => state.repoPath);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: items = [], isLoading } = useQuery<string[]>({
    queryKey: ["branches", repoPath],
    queryFn: () => {
      return getLocalBranches(repoPath);
    },
    enabled: isOpen,
  });

  const { invalidateAll } = useQueryInvalidation();
  const addLog = useGitLogStore((s) => s.addLog);

  const switchMutation = useMutation({
    mutationFn: (branch: string) => switchBranch(repoPath, branch),
    onSuccess: () => {
      addLog("INFO: Switched branch successfully");
      invalidateAll(repoPath);
      setIsOpen(false);
    },
    onError: (err: Error) => {
      addLog("FATAL: Failed to switch branch: " + err.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: (branch: string) => createAndSwitchToBranch(repoPath, branch),
    onSuccess: () => {
      addLog("INFO: Created and switched to branch successfully");
      invalidateAll(repoPath);
      setIsOpen(false);
      setInputValue("");
    },
    onError: (err: Error) => {
      addLog("FATAL: Failed to create branch: " + err.message);
    },
  });

  const handleItemClick = (branch: string) => {
    switchMutation.mutate(branch);
  };

  const handleCreate = (value: string) => {
    createMutation.mutate(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex z-50"
    >
      <div onClick={() => {
        console.log("Clicking el button", items)
        setIsOpen((prev) => !prev)
      }}>
        {trigger}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full pb-2 z-50 bg-neutral-900  shadow-[4px_4px_0px_rgba(0,0,0,1)] mt-1 flex min-w-60 flex-col gap-2 overflow-hidden border border-neutral-700">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreate(inputValue);
          }}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type to create a branch"
              className="w-full px-2 py-2 rounded-sm text-sm border-b border-neutral-700 bg-neutral-950"
            />
          </form>

          <div className="flex max-h-64 flex-col overflow-y-auto">
            {inputValue.trim() && (
              <button
                type="button"
                onClick={() => handleCreate(inputValue)}
                className="text-left text-green-200 text-sm px-2 py-1 hover:bg-neutral-700 flex items-center gap-2 border-b border-neutral-800"
              >
                <Plus size={12}/>
                Create "{inputValue}"
              </button>
            )}

            {isLoading && <div>Loading...</div>}

            {!isLoading &&
              items.map((branch, idx) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => handleItemClick(branch)}
                  className="text-left text-sm px-2 hover:bg-neutral-700 border-b border-neutral-800 border-dashed"
                >
                  {branch}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
