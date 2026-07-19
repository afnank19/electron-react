import type { ChatItem } from "../../../state/chat-store";

type ToolChatItemProps = {
  item: ChatItem
}

export function ToolChatItem({ item }: ToolChatItemProps) {
  return (
    <div className="px-1.5 py-0.5 mx-1 border-l border-neutral-400 bg-neutral-900">
      <div className="flex gap-2 items-center">
        <p className="text-sm font-bold">Tool invoked</p>
        <p className="text-xs text-neutral-400 font-bold">{item.tool}</p>
      </div>
      <p className="text-xs px-2 italic text-neutral-400">Arguments: {item.params}</p>
    </div>
  )
}
