import { useMutation } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import React from "react";
import { useAppStore, useRepoStore } from "../state/repo-store";
import { useQueryInvalidation } from "../queries/use-query-invalidation";
import { useChatStore } from "../state/chat-store";
import { ChatItemRenderer } from "./chat/chat-item-renderer";

// TODO:
// * Display different message types whenever emitted
// * User messages actually show up in chat
// * User messages trigger runs
// * Disabling input when a workflow is running.


// REMOVE AFTER NO LONGER NEEDED
const AGENT_REQ_PROMPT = "Stage my changes.";

export const ChatPanel = () => {
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);
  const repoPath = useRepoStore((s) => s.repoPath);
  const { invalidateAll } = useQueryInvalidation();
  const items = useChatStore((s) => s.items);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      console.log("beginning agent request");
      return window.ai.agentRequest(AGENT_REQ_PROMPT);
    },
    onSuccess: (data) => {
      console.log("successfully ran, triggering refresh", data);
      // triggerRefresh();
      invalidateAll(repoPath);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  return (
    <div className="border border-neutral-800 bg-[#151515] flex flex-col h-full">
      <h2 className="px-2 py-1 font-bold mb-4">Workflow Agent</h2>

      {/* TO BE REMOVED AFTER TESTING */}
      <p className="text-sm my-2">Current Prompt: {AGENT_REQ_PROMPT}</p>
      <button
        onClick={() => {
          mutate();
        }}
        className="font-bold text-xs my-1  p-1 w-fit border  bg-red-700 border-red-500 hover:bg-red-600 hover:border-red-500 shadow-[3px_3px_0px_rgba(0,0,0,0.9)]"
      >
        Hard Coded Prompt Agent Text Button
      </button>
      <p className="m-2 font-bold text-sm">
        [{isPending ? "CLICKITY CLANKING CLANK" : "IDLE"}]
      </p>
      {/* ABOVE TO BE REMOVED AFTER TESTING*/}

      <div className="flex-1 overflow-y-auto mb-4  pb-4">
        {/* Chat messages would go here */}
        <p className="text-neutral-500 italic border border-neutral-800">
          They call me CLANKER, clankiest of clankland
        </p>
        {items && items.map((msg, idx) => {
          return (
            <ChatItemRenderer item={msg} />
          )
        })}
      </div>
      <div className="flex gap-2 border-t-2 p-2 border-neutral-800">
        <input
          type="text"
          placeholder="Specify a custom workflow"
          className="flex-1 py-1 px-2  text-sm border border-neutral-700 bg-neutral-900"
        />
        <button className="font-bold text-xs  px-1.5 border  bg-orange-700 border-orange-600 hover:bg-orange-600 hover:border-orange-500 shadow-xl">
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
};
