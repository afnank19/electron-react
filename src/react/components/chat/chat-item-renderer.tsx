import Markdown from "react-markdown";
import type { ChatItem } from "../../state/chat-store";
import { ToolChatItem } from "./item-types/tool-chat-item";

type ChatItemRendererProps = {
  item: ChatItem;
};

export function ChatItemRenderer({ item }: ChatItemRendererProps) {
  switch (item.type) {
    case "user": {
      return (
        <div className="mx-2 my-1 max-w-3/4 self-end rounded-full border border-neutral-700 bg-linear-to-b from-neutral-800 to-neutral-700 px-4 text-sm shadow-xs shadow-neutral-950">
          {item.message}
        </div>
      );
    }
    case "message": {
      return (
        <div className="m-1 px-2 text-sm break-all">
          <Markdown>{item.message}</Markdown>
        </div>
      );
    }
    case "tool_call": {
      return (
        // <div className="font-mono text-sm px-2 m-1 border-l border-green-500">
        //   Tool Invoked: {item.tool}
        //   <p>Parameters: {item.params} </p>
        // </div>
        <ToolChatItem item={item} />
      );
    }
    case "log": {
      return (
        <div className="m-1 border-l border-neutral-300 px-2 font-mono text-sm">
          <p>LOG: {item.message}</p>
        </div>
      );
    }
    default: {
      return <div className="italic">Invalid message type!</div>;
    }
  }
}
