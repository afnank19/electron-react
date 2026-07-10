import { useState } from "react";
import OpenRepoLayout from "./components/layouts/open-repo-layout";
import GitStatus from "./components/git-status";
import GitBranch from "./components/git-branch";
import Tabs from "./components/tabs";
import { GitCommits } from "./components/git-commits";
import { useRepoStore } from "./state/repo-store";
import { Viewer } from "./components/viewer";
import { Logs } from "./components/logs";
import { GitRemote } from "./components/git-remote";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatPanel } from "./components/chat-panel";
import { OpenRepo } from "./components/open-repo";
import { FolderGit } from "lucide-react";
import { Onboarding } from "./components/onboarding";
import { Group, Panel, Separator } from "react-resizable-panels";

const queryClient = new QueryClient();

const App = () => {
  const repoPath = useRepoStore((state) => state.repoPath);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-display h-screen">
        <Tabs />
        {repoPath !== null ? (
          <>
            <OpenRepoLayout />
            <div className="flex">
              {/* <div className="flex-1 max-w-1/3 h-full">*/}
                {/* <GitStatus />*/}
                {/* <GitCommits />*/}
                {/* <GitBranch />*/}
              {/* </div>*/}

              <Group orientation="vertical" className="min-h-228 max-w-1/3">
                <Panel>
                  <GitStatus />
                </Panel>
                <Panel>
                  <GitCommits />
                </Panel>
              </Group>
              <div className="flex-1 max-w-1/3 h-full flex flex-col mr-2">
                <div className="flex flex-col gap-2">
                  <GitRemote />
                  <div className="flex flex-col gap-2">
                    <div className=" border rounded-2xl border-neutral-800 min-h-115 max-h-115">
                      <Viewer />
                    </div>
                    <Logs />
                  </div>
                </div>
              </div>
              <div className="flex-1 max-w-1/3 h-full flex flex-col mr-2">
                <ChatPanel />
              </div>
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
