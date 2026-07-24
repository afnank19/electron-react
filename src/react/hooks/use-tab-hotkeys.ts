import { useHotkeys } from "react-hotkeys-hook";
import { useRepoStore, useTabStore } from "../state/repo-store";
import { useQueryInvalidation } from "../queries/use-query-invalidation";

export function useTabHotkeys() {
  const tabs = useTabStore((state) => state.tabs);
  const addTab = useTabStore((state) => state.addTab);
  const removeTab = useTabStore((state) => state.removeTab);
  const repoPath = useRepoStore((state) => state.repoPath);
  const setRepoPath = useRepoStore((state) => state.setRepoPath);
  const { invalidateAll } = useQueryInvalidation();

  const switchToTab = (tab: { id: string; repoPath: string }) => {
    localStorage.setItem("repo-path", tab.repoPath);
    setRepoPath(tab.repoPath);
    window.app.setRepoPath(tab.repoPath);
    invalidateAll(tab.repoPath);
  };

  useHotkeys("ctrl+t, cmd+t", async (e) => {
    e.preventDefault();
    const path = await window.repoAPI.openRepo();
    if (!path || path.error) return;
    localStorage.setItem("repo-path", path);
    setRepoPath(path);
    addTab({ id: crypto.randomUUID(), repoPath: path });
  });

  useHotkeys("ctrl+w, cmd+w", (e) => {
    e.preventDefault();
    if (!repoPath) return;
    const activeTab = tabs.find((t: any) => t.repoPath === repoPath);
    if (activeTab) removeTab(activeTab.id);
  });

  useHotkeys("ctrl+tab", (e) => {
    e.preventDefault();
    if (tabs.length < 2) return;
    const currentIdx = tabs.findIndex((t: any) => t.repoPath === repoPath);
    const nextIdx = (currentIdx + 1) % tabs.length;
    switchToTab(tabs[nextIdx]);
  });

  useHotkeys("ctrl+shift+tab", (e) => {
    e.preventDefault();
    if (tabs.length < 2) return;
    const currentIdx = tabs.findIndex((t: any) => t.repoPath === repoPath);
    const prevIdx = (currentIdx - 1 + tabs.length) % tabs.length;
    switchToTab(tabs[prevIdx]);
  });
}
