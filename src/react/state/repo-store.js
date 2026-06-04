// Zustand repo store for git repo
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useRepoStore = create((set) => ({
  repoPath: null,
  setRepoPath: (path) => set({ repoPath: path })
}));

// here, tabs will look something like this:
// { id, repoPath as the name }
export const useTabStore = create(
  persist(
    (set) => ({
      tabs: [],

      addTab: (tab) =>
        set((state) => {
          if (state.tabs.some((t) => t.repoPath === tab.repoPath)) {
            return state;
          }

          return {
            tabs: [...state.tabs, tab],
          };
        }),

      removeTab: (id) =>
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.id !== id),
        })),
    }),
    {
      name: "tab-store", // localStorage key
    }
  )
);

export const useAppStore = create((set) => ({
  refreshCounter: 0,
  triggerRefresh: () =>
    set((state) => ({
      refreshCounter: state.refreshCounter + 1,
    })),
}))

// Don't know how this will look, but I'm gonna build it for
// the file diff viewer use case first
// Probably a viewer mode, default will be commit viewer which uses show instead of diff
// and based on the interaction, the mode switches
export const useViewerStore = create((set) => ({
  fileDiff: null,
  setFileDiff: (fileDiff) => set({fileDiff: fileDiff})
}))
