import type { ChatItem } from "../../../state/chat-store";

type ToolChatItemProps = {
  item: ChatItem
}

export function ToolChatItem({ item }: ToolChatItemProps) {
  return (
    <div className="px-1.5 py-0.5 mx-1 border-l border-neutral-400 bg-neutral-900">
      <p className="text-sm font-bold">Tool invoked</p>
      <div className="px-2">
        <p className="text-xs text-neutral-400">{item.tool}</p>
        <p className="text-xs italic text-neutral-400">Arguments: {item.params}</p>
      </div>
    </div>
  )
}
