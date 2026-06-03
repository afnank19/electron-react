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
