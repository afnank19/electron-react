import React from 'react';

export const ChatPanel = () => {
  return (
    <div className="border border-neutral-800 rounded-lg p-4 h-full flex flex-col bg-neutral-900">
      <h2 className="text-lg font-bold mb-4">Chat</h2>
      <div className="flex-1 overflow-y-auto mb-4 border-b border-neutral-700 pb-4">
        {/* Chat messages would go here */}
        <p className="text-neutral-500 italic">Chat messages placeholder...</p>
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Ask a question..." 
          className="flex-1 bg-neutral-800 p-2 rounded border border-neutral-700"
        />
        <button className="bg-blue-600 px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
};
