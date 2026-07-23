import EventEmitter from "events";
import type { ChatItem, ChatItemType } from "../react/state/chat-store";

export const eventBus = new EventEmitter();

export function emitAgentEvent(event: ChatItem) {
  eventBus.emit("agent:event", event);
}

export type AgentEvent = {
  type: ChatItemType;
  message: string;
  tool: string;
};
