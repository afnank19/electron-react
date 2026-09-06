import { useMutation } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppStore, useRepoStore } from "../state/repo-store";
import { useQueryInvalidation } from "../queries/use-query-invalidation";
import { useChatStore } from "../state/chat-store";
import { ChatItemRenderer } from "./chat/chat-item-renderer";

// TODO:
// * Display different message types whenever emitted [done]
// * User messages actually show up in chat [done]
// * User messages trigger runs [done]
// * Disabling input when a workflow is running.

// REMOVE AFTER NO LONGER NEEDED
const AGENT_REQ_PROMPT = "Stage my changes.";

export const ChatPanel = () => {
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);
  const repoPath = useRepoStore((s) => s.repoPath);
  const { invalidateAll } = useQueryInvalidation();
  const items = useChatStore((s) => s.items);
  const addItem = useChatStore((s) => s.addItem);
  const clearItems = useChatStore((s) => s.clearItems);

  const [userMsg, setUserMsg] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: ({ message, ctx }) => {
      console.log("beginning agent request", message, ctx);
      return window.ai.agentRequest(message, ctx);
    },
    onSuccess: (data) => {
      console.log("successfully ran, triggering refresh", data);
      // triggerRefresh();
      addItem({
        type: "message",
        message: data,
      });
      invalidateAll(repoPath);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  function handleSubmit() {
    console.log("submitting req", userMsg);
    addItem({
      type: "user",
      message: userMsg,
    });

    mutate({ message: userMsg, ctx: items });
    setUserMsg("");
  }

  useEffect(() => {
    clearItems();
  }, [repoPath]);

  return (
    <div className="flex h-full flex-col border border-neutral-800">
      <h2 className="mb-4 border-b border-neutral-800 px-2 py-1 text-sm font-bold">
        Workflow Agent
      </h2>

      <div className="mb-4 flex flex-1 flex-col gap-2 overflow-y-auto pb-4">
        {items &&
          items.map((msg, idx) => {
            return <ChatItemRenderer item={msg} />;
          })}
      </div>
      <div className="flex gap-2 border-t-2 border-neutral-800 p-2">
        <form
          className="flex flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            placeholder="Specify a custom workflow"
            className="flex-1 border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
            value={userMsg}
            onChange={(e) => {
              setUserMsg(e.target.value);
            }}
            disabled={isPending}
          />
        </form>
        <button
          onClick={handleSubmit}
          className="border border-neutral-200 bg-neutral-100 px-1.5 text-xs font-bold text-neutral-800 shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-300 hover:bg-neutral-200"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
};
