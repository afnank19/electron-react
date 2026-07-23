import type { ChatItem } from "../../../state/chat-store";

type ToolChatItemProps = {
  item: ChatItem;
};

export function ToolChatItem({ item }: ToolChatItemProps) {
  return (
    <div className="mx-1 border-l border-neutral-400 bg-neutral-900 px-1.5 py-0.5">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold">Tool invoked</p>
        <p className="text-xs font-bold text-neutral-400">{item.tool}</p>
      </div>
      <p className="px-2 text-xs text-neutral-400 italic">Arguments: {item.params}</p>
    </div>
  );
}
