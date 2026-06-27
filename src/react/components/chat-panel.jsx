import { ArrowUp } from 'lucide-react';
import React from 'react';

export const ChatPanel = () => {
  return (
    <div className="border border-neutral-800 max-h-[875px] min-h-[875px] rounded-2xl p-2 my-2 flex flex-col ">
      <h2 className="text-lg font-bold mb-4">Workflow Agent</h2>
      <div className="flex-1 overflow-y-auto mb-4  pb-4">
        {/* Chat messages would go here */}
        <p className="text-neutral-500 italic border border-neutral-800">They call me CLANKER, clankiest of clankland</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Specify a custom workflow"
          className="flex-1  px-2 rounded-lg text-sm border border-neutral-700"
        />
        <button className="font-bold text-xs  rounded-lg px-1  bg-blue-600 hover:bg-blue-400">
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
};
