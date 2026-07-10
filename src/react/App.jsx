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

const queryClient = new QueryClient();

const App = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-display h-screen flex flex-col">
        <Tabs />

        {repoPath !== null ? (
          <>
            <OpenRepoLayout />

            <div className="flex-1 min-h-0 mx-2">
              <Group className="h-full">
                <Panel defaultSize={33}>
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

                <Panel defaultSize={34}>
                  <Group orientation="vertical" className="h-full">
                    <Panel defaultSize={25} maxSize={70}>
                      <div className="h-full min-h-0 overflow-hidden">
                        <GitRemote />
                      </div>
                    </Panel>

                    <Panel defaultSize={50}>
                      <div className="h-full min-h-0 border border-neutral-800 overflow-hidden">
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

                <Panel defaultSize={33}>
                  <div className="h-full min-h-0 flex flex-col">
                    <ChatPanel />
                  </div>
                </Panel>
              </Group>
            </div>
          </>
        ) : (
          <Onboarding />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default App;
