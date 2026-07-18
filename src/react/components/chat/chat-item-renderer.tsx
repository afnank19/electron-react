import Markdown from "react-markdown";
import type { ChatItem } from "../../state/chat-store";

type ChatItemRendererProps = {
  item: ChatItem
}

export function ChatItemRenderer({ item }: ChatItemRendererProps) {
  switch (item.type) {
    case "user": {
      return (
        <div className="italic p-2">{ item.message }</div>
      )
    }
    case "message": {
      return (
        <div className="text-sm px-2 m-1 border-l border-blue-500">
          <Markdown>
            {item.message}
          </Markdown>
        </div>
      )
    }
    case "tool_call": {
      return (
        <div className="font-mono text-sm px-2 m-1 border-l border-green-500">
          Tool Invoked: {item.tool}
          <p>Parameters: {item.params} </p>
        </div>
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
