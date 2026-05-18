// Zustand repo store for git repo
import { create } from "zustand";

export const useRepoStore = create((set) => ({
  repoPath: null,
  setRepoPath: (path) => set({ repoPath: path })
}));