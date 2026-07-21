import Markdown from "react-markdown";
import type { ChatItem } from "../../state/chat-store";
import { ToolChatItem } from "./item-types/tool-chat-item";

type ChatItemRendererProps = {
  item: ChatItem
}

export function ChatItemRenderer({ item }: ChatItemRendererProps) {
  switch (item.type) {
    case "user": {
      return (
        <div className="text-sm px-4 my-1 mx-2 border border-neutral-700 self-end bg-linear-to-b from-neutral-800 to-neutral-700 max-w-3/4 shadow-xs shadow-neutral-950 rounded-full">
          {item.message}
        </div>
      )
    }
    case "message": {
      return (
        <div className="text-sm px-2 m-1 break-all">
          <Markdown>
            {item.message}
          </Markdown>
        </div>
      )
    }
    case "tool_call": {
      return (
        // <div className="font-mono text-sm px-2 m-1 border-l border-green-500">
        //   Tool Invoked: {item.tool}
        //   <p>Parameters: {item.params} </p>
        // </div>
        <ToolChatItem item={item} />
      )
    }
    case "log": {
      return (
        <div className="font-mono text-sm px-2 m-1 border-l border-orange-500">
          <p>LOG: { item.message }</p>
        </div>
      )
    }
    default: {
      return (
        <div className=" italic">Invalid message type!</div>
      )
    }
  }
}
