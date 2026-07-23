import OpenRepoLayout from "./components/layouts/open-repo-layout";
import GitStatus from "./components/git-status";
import Tabs from "./components/tabs";
import { GitCommits } from "./components/git-commits";
import { useRepoStore } from "./state/repo-store";
import { Viewer } from "./components/viewer";
import { Logs } from "./components/logs";
import { GitRemote } from "./components/git-remote";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatPanel } from "./components/chat-panel";
import { Onboarding } from "./components/onboarding";
import { Group, Panel } from "react-resizable-panels";
import { useAgentEvents } from "./hooks/use-agent-events";

const queryClient = new QueryClient();

const AppContent = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  useAgentEvents();

  return (
    <div className="font-display flex h-screen flex-col">
      <Tabs />

      {repoPath !== null ? (
        <>
          <OpenRepoLayout />

          <div className="mb-2 min-h-0 flex-1">
            <Group className="h-full">
              <Panel defaultSize={25}>
                <Group orientation="vertical" className="h-full">
                  <Panel defaultSize={50}>
                    <div className="h-full min-h-0 overflow-hidden">
                      <GitStatus />
                    </div>
                  </Panel>

                  <Panel defaultSize={50}>
                    <div className="h-full min-h-0 overflow-hidden">
                      <GitCommits />
                    </div>
                  </Panel>
                </Group>
              </Panel>

              <Panel defaultSize={25}>
                <div className="flex h-full min-h-0 flex-col">
                  <ChatPanel />
                </div>
              </Panel>

              <Panel defaultSize={50}>
                <Group orientation="vertical" className="h-full">
                  <Panel defaultSize={25} maxSize={70}>
                    <div className="h-full min-h-0 overflow-hidden">
                      <GitRemote />
                    </div>
                  </Panel>

                  <Panel defaultSize={50}>
                    <div className="h-full min-h-0 border border-neutral-800">
                      <Viewer />
                    </div>
                  </Panel>

                  <Panel defaultSize={25}>
                    <div className="h-full min-h-0 overflow-hidden">
                      <Logs />
                    </div>
                  </Panel>
                </Group>
              </Panel>
            </Group>
          </div>
        </>
      ) : (
        <Onboarding />
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
