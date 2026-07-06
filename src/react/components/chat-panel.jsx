import { useMutation } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import React from "react";
import { useAppStore } from "../state/repo-store";

// REMOVE AFTER NO LONGER NEEDED
const AGENT_REQ_PROMPT = "Stage and commit my changes.";

export const ChatPanel = () => {
  const triggerRefresh = useAppStore((s) => s.triggerRefresh);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      console.log("beginning agent request");
      return window.ai.agentRequest(AGENT_REQ_PROMPT);
    },
    onSuccess: (data) => {
      console.log("successfully ran, triggering refresh", data);
      triggerRefresh();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  return (
    <div className="border border-neutral-800 bg-[#111111] max-h-[875px] min-h-[875px] rounded-2xl p-2 my-2 flex flex-col ">
      <h2 className="text-lg font-bold mb-4">Workflow Agent</h2>
      {/* TO BE REMOVED AFTER TESTING */}
      <p className="text-sm my-2">Current Prompt: {AGENT_REQ_PROMPT}</p>
      <button
        onClick={() => {
          mutate();
        }}
        className="font-bold text-xs my-1  rounded-lg p-1 w-fit border  bg-red-700 border-red-600 hover:bg-red-600 hover:border-red-500 shadow-xl"
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
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Specify a custom workflow"
          className="flex-1  px-2 rounded-lg text-sm border border-neutral-800 bg-neutral-900"
        />
        <button className="font-bold text-xs  rounded-lg px-1 border  bg-orange-700 border-orange-600 hover:bg-orange-600 hover:border-orange-500 shadow-xl">
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
};
