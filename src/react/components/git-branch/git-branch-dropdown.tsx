import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLocalBranches } from "../../api/git-api/git-branch-api";
import { useRepoStore } from "../../state/repo-store";

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

  const handleItemClick = (branch: string) => {
    // TODO: implement item click behavior
    console.log("Clicking Branch", branch)
  };

  const handleCreate = (value: string) => {
    // TODO: implement create behavior
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
        <div className="absolute left-0 top-full z-50 bg-neutral-700 mt-1 flex min-w-60 flex-col gap-2 overflow-hidden">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search or create..."
            className="w-full"
          />

          <div className="flex max-h-64 flex-col overflow-y-auto">
            {inputValue.trim() && (
              <button
                type="button"
                onClick={() => handleCreate(inputValue)}
                className="text-left"
              >
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
                  className="text-left"
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
